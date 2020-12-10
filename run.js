const contractCall = require('./contractCall');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const ACCOUNT_ADDRESS = process.env.ETH_ADDRESS;;

/*
    Yearn Deployed Contract Registry
    https://andrecronje.gitbook.io/yearn-finance/developers/deployed-contracts-registry
*/

const vaultData = [
    {
        vaultName: "Dai Vault",
        vaultAddress: "0xACd43E627e64355f1861cEC6d3a6688B31a6F952",
        vaultAbiPath: path.dirname(require.main.filename)+'/contractAbis/yearnDaiVault.json'
    },
    {
        vaultName: "Curve sBTC LP Vault",
        vaultAddress: "0x7ff566e1d69deff32a7b244ae7276b9f90e9d0f6",
        vaultAbiPath: path.dirname(require.main.filename)+'/contractAbis/yearnDaiVault.json'
    }
]

let cronValue = "0 12 * * *";
let postTask = cron.schedule(cronValue, () => {
    vaultData.forEach(d=>{
        contractCall(ACCOUNT_ADDRESS,d.vaultAddress,d.vaultAbiPath,d.vaultName).then(result=>{
            console.log(d.vaultName,"Complete.");
        })
    })
})

