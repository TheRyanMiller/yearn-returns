const Balance = require('../schemas/balance');

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