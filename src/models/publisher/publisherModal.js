const mongoose = require("mongoose");
require("../../config/db");
const Collection = require("../../config/collection");
const { getPasswordHash } = require("../../utils/password");
const ManagerModal = require("../manager/managerModel");


const publisherSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, "firstName is required field"] },
    lastName: { type: String},
    email: { type: String, required: [true, "Email is required field"], unique: true, },
    userName: { type: String, required: [true, "userName is required field"], unique: true },
    password: { type: String, required: [true, "Password is required field"] },
    messengerType: { type: String, required: [true, "messanger name is required field"] },
    messengerAccount: { type: String, required: [true, "messanger account is required field"] },
    managerId: { type: mongoose.SchemaTypes.ObjectId, ref: ManagerModal },
    uniqueID:{type:Number,required:true,unique:true},
    siteStore:{type:mongoose.SchemaTypes.ObjectId}  
  },
  { timestamps: true }
);

publisherSchema.pre("save", function () {
  this.password = getPasswordHash(this.password);
});

const PublisherModal = mongoose.model(
  Collection.UserPublisher,
  publisherSchema
);

module.exports = PublisherModal;
