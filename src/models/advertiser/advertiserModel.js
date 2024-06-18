const mongoose = require("mongoose");
require("../../config/db");
const Collection = require("../../config/collection");
const ManagerModal = require("../manager/managerModel");
const { getPasswordHash } = require("../../utils/password");
 

const advertiserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "firstName is required field"] },
    lastName: { type: String},
    email: { type: String, required: [true, "Email is required field"], unique: true, },
    userName: { type: String, required: [true, "userName is required field"], unique: true },
    password: { type: String, required: [true, "Password is required field"] },
    messengerType: { type: String, required: [true, "messenger name is required field"] },
    messengerAccount: { type: String, required: [true, "messenger account is required field"] },
    managerId: { type: mongoose.SchemaTypes.ObjectId, ref: ManagerModal },
    campaignStore: { type: mongoose.SchemaTypes.ObjectId },
    uniqueID:{type:Number,required:true,unique:true},
  },
  { timestamps: true }
);
advertiserSchema.pre("save", function () {

   
  this.password = getPasswordHash(this.password);
});

const AdvertiserModal = mongoose.model(
  Collection.UserAdvertiser,
  advertiserSchema
);

module.exports = AdvertiserModal;
