/*
    Yearn Deployed Contract Registry
    https://andrecronje.gitbook.io/yearn-finance/developers/deployed-contracts-registry
*/
const contractCall = require('./contractCall');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');

const ACCOUNT_ADDRESS = process.env.ETH_ADDRESS;
const url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,dai,true-usd,tether,usd-coin,chainlink,yearn-finance,binance-usd,wrapped-bitcoin,ethereum,nusd,chainlink,aave-link,lp-sbtc-curve,lp-bcurve,curve-fi-ydai-yusdc-yusdt-ytusd,lp-3pool-curve,gemini-dollar,curve-dao-token&vs_currencies=usd,eth"




//Prepare file paths for interoperatbility between dev/prod env
let correctedPath = path.normalize(path.dirname(require.main.filename)+'/vault.data.json');
let vaultData = JSON.parse(fs.readFileSync(correctedPath));

let cronValue = process.env.CRON_VALUE;
console.log("Cron value: ",process.env.CRON_VALUE);

let postTask = cron.schedule(cronValue, () => {
    // Collect Earning Data
    axios.get(url).then((response, error) => {    
        if(error) throw error;
        //console.log("BALANCES GET ALL",response.data);
        vaultData.forEach(d=>{
            for (const [key, value] of Object.entries(response.data)) {
                //console.log(`${key}: ${value.usd}`);
                if(key === d.priceId){
                    d.currentUsdValue = value.usd;
                    break;
                };
            }
            vaultAbiPath = path.normalize(path.dirname(require.main.filename)+'/contractAbis/'+d.abiFileName);
            contractCall(ACCOUNT_ADDRESS, d.vaultAddress, vaultAbiPath, d.vaultName, d.priceId, d.currentUsdValue, true).then(result=>{
                console.log(d.vaultName,"Complete.");
            })
        })
    }).catch(err => console.log(err));
})

