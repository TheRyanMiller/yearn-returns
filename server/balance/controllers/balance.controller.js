const Balance = require('../schemas/balance');
const axios = require('axios');

exports.getById = (req, res) => {
    let balanceId = req.params.balanceId;
    Balance.find(query,(err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>{
        console.log(err)
        return res.json({ success: false, error: err });
    });
};

exports.getAll = (req, res) => {
    let query = {};
    let sort = { createdAt : 1 };
    Balance.find(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
};

exports.getTotalGains = (req, res) => {
    let firstRecords;
    let lastRecords;
    let firstRecordOfEachVault = [
        {
            "$group": {
                "_id": "$priceId",
                "doc": { "$first": "$$ROOT" }
            }
        }
    ];
    Balance.aggregate(firstRecordOfEachVault).then((data,err) => {
        const url = "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,dai,true-usd,tether,usd-coin,chainlink,yearn-finance,binance-usd,wrapped-bitcoin,ethereum,nusd,chainlink,aave-link,lp-sbtc-curve,lp-bcurve,curve-fi-ydai-yusdc-yusdt-ytusd,lp-3pool-curve,gemini-dollar,curve-dao-token&vs_currencies=usd,eth";
        axios.get(url).then(geckoPrices => {
            firstRecords = data;
            let result = [];
            if (err) return res.json({ success: false, error: err });
            let lastRecordOfEachVault = [
                {
                    "$group": {
                        "_id": "$priceId",
                        "doc": { "$last": "$$ROOT" }
                    }
                }
            ];
            Balance.aggregate(lastRecordOfEachVault).then((data,err) => {
                lastRecords = data;
                let difference = {};
                firstRecords.forEach(r => {
                    
                    difference = {
                        priceId: r.doc.priceId,
                        underlyingGain: r.doc.underlyingBalance
                    };

                    console.log(geckoPrices.data[r.doc.priceId])
                    if(geckoPrices.data[r.doc.priceId]) difference.usdPriceUnderlying = geckoPrices.data[r.doc.priceId].usd;
                    lastRecords.forEach(x =>{
                        if(r._id === x._id){
                            difference.underlyingGain = x.doc.underlyingBalance - r.doc.underlyingBalance;
                            difference.underlyingBalance = x.doc.underlyingBalance;
                            difference.underlyingBalanceOriginal = r.doc.underlyingBalance;
                        }
                    });
                    difference.usdGain = difference.underlyingGain * difference.usdPriceUnderlying;
                    result.push(difference);
                })
                if (err) return res.json({ success: false, error: err });
                return res.json({ success: true, data: result })
            }).catch(err=>{
                console.log(err)
                throw err;
            });        
        //return res.json({ success: true, data: data })
        })
    })
};

exports.calculateGains = (req, res) => {
    let query = {};
    let sort = { createdAt : 1 };
    let formattedList = {};
    Balance.find(query).sort(sort).then((data,err) => {
        data.forEach(d=>{
            if(d.priceId && !formattedList[d.priceId]){
                formattedList[d.priceId] = {
                    low: undefined,
                    high: undefined
                };
            }
            
            if(d.priceId && formattedList[d.priceId]){
                if(!formattedList[d.priceId].low) formattedList[d.priceId].low = d.underlyingBalance;
                if(!formattedList[d.priceId].high) formattedList[d.priceId].high = d.underlyingBalance;
            }
            if(d.underlyingBalance>formattedList[d.priceId].high) formattedList[d.priceId].high = d.underlyingBalance;
            if(d.underlyingBalance<formattedList[d.priceId].low) formattedList[d.priceId].low = d.underlyingBalance;
        })
        Object.keys(formattedList).forEach(key=>{
            let gain = formattedList[key].high - formattedList[key].low;
            formattedList[key].gain = gain;
        })
        if (err) return res.json({ success: false, error: "An error has occurred." });
        return res.json({ success: true, data: formattedList })
    })
};

exports.getLast = (req, res) => {
    let sort = { createdAt : -1 };
    let query = {};
    Balance.findOne(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
};

exports.getFirst = (req, res) => {
    let sort = { createdAt : 1 };
    let query = {};
    Balance.findOne(query).sort(sort).then((data,err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data })
    })
    .catch(err=>console.log(err))
};



exports.addBalance = (req, res) => {
    let b = req.body.balanceId;
    console.log(b)
    if(o.extra && o.extra.done_reason=="canceled"){
        o.status = "canceled";
    }
    let balanceRecord = new BalanceRecord({
        accountAddress: b.accountAddress,
        vaultName: b.vaultName,
        vaultNameFriendly: b.vaultNameFriendly,
        vaultAddress: b.vaultAddress,
        underlyingBalance: b.underlyingBalance,
        yTokenBalance: b.yTokenBalance,
        contractBalance: b.contractBalance,
        pricePerFullShare: b.pricePerFullShare,
        underlyingUsdValue: b.underlyingUsdValue,
        yTokenUsdValue: b.yTokenUsdValue
    })
    balanceRecord.save((err)=>{
        if(err) return res.json({ success: false, error: err });
        return res.json({ 
            success: true,
            message: "Balance written successfully." 
        });
    });
};