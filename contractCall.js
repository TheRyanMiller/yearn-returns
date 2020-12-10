const Web3 = require('web3');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const BalanceRecord = require('./schemas/balance_record');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GETH_NODE));

let underlyingBalance;
let yTokenBalance;
let contractBalance;
let pricePerFullShare;
let yTokenUsdValue;
let underlyingUsdValue;

module.exports = (accountAddress,contractAddress,contractAbiPath,contractFriendlyName) => new Promise ((resolve,reject) => {
    let correctedPath = path.normalize(contractAbiPath);
    let parsedABI = JSON.parse(fs.readFileSync(correctedPath));
    let contract = new web3.eth.Contract(parsedABI, contractAddress);
    vaultNameFriendly=contractFriendlyName;
    contract.methods.balanceOf(accountAddress).call().then(balance=>{
        let yTokenBalance = balance * 1e18
        console.log(vaultNameFriendly+" yToken balance:",yTokenBalance)
        contract.methods.getPricePerFullShare().call().then(pps=>{
            pricePerFullShare = pps;
            underlyingBalance = pps * yTokenBalance;
            console.log(vaultNameFriendly+" underlying balance:",underlyingBalance)
            contract.methods.name().call().then(vaultName=>{
                let balanceRecord = new BalanceRecord({
                    accountAddress,
                    vaultName,
                    vaultNameFriendly,
                    vaultAddress: contractAddress,
                    underlyingBalance,
                    yTokenBalance,
                    contractBalance,
                    pricePerFullShare,
                    underlyingUsdValue,
                    yTokenUsdValue
                })
                balanceRecord.save((err)=>{
                    if(err){
                        console.log(err, vaultNameFriendly,"Error writing new record data to mongodb.");
                        reject(err);
                    }
                    console.log("Succesfully written.")
                    resolve();
                })
            })
        })
    })
})

