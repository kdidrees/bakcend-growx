const mongoose = require("mongoose")
require("../../config/db")
const Collection = require("../../config/collection")
const walletSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    amount:{
        type:Number,
    }
})
const   WalletModel = mongoose.model(Collection.Wallet,walletSchema)
module.exports = WalletModel;