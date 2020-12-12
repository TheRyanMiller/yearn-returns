const Web3 = require('web3');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const BalanceRecord = require('./server/balance/schemas/balance');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.GETH_NODE));
let contractBalance;

module.exports = (accountAddress, contractAddress, contractAbiPath, vaultNameFriendly, priceId, currentUnitUsdValue, writeData) => new Promise ((resolve,reject) => {
    let correctedPath = path.normalize(contractAbiPath);
    let parsedABI = JSON.parse(fs.readFileSync(correctedPath));
    let contract = new web3.eth.Contract(parsedABI, contractAddress);
    contract.methods.balanceOf(accountAddress).call().then(balance=>{
        let yTokenBalance = balance / 1e18;
        console.log("YYYYYYYYYYY --->",yTokenBalance)
        contract.methods.getPricePerFullShare().call().then(pps=>{
            let pricePerFullShare = pps / 1e18;
            let underlyingBalance = pricePerFullShare * yTokenBalance;
            console.log("XXXXXXXX --->",yTokenBalance)
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
                    underlyingUsdValue: underlyingBalance * currentUnitUsdValue,
                    currentUnitUsdValue,
                    priceId
                })
                if(writeData){
                    balanceRecord.save((err)=>{
                        if(err){
                            console.log(err, vaultNameFriendly,"Error writing new record data to mongodb.");
                            reject(err);
                        }
                        console.log("Succesfully written.",priceId)
                        resolve(balanceRecord);
                    })
                }
                else{
                    resolve(balanceRecord);
                }
            })
        })
    })
})

