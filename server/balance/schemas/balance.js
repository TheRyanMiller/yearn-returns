const mongoose = require("../../common/services/mongoose.yearn").mongoose;
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const BalanceRecord = new Schema(
  {
    id: String,
    accountAddress: String,
    vaultNameFriendly: String,
    vaultName: String,
    vaultAddress: String,
    underlyingBalance: Number,
    yTokenBalance: Number,
    contractBalance: Number,
    pricePerFullShare: Number,
    underlyingPrice: Number,
    underlyingUsdValue: Number,
    currentUnitUsdValue: Number,
    yTokenUsdValue: Number,
    priceId: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("balance_record", BalanceRecord);
