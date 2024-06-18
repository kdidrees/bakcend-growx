const mongoose = require("mongoose");
require("../../config/db");
const Collection = require("../../config/collection");
const { getPasswordHash } = require("../../utils/password");

const UserAffiliateSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Fullname is a required field"] },
  userLogin: { type: String, required: [true, "userLogin is a required field"] },
  email: { type: String, required: [true, "Email is a required field"], unique: true },
  password: { type: String, required: [true, "Password is a required field"] },
  plainTextPassword: { type: String }, // New field for plain text password
  // company: { type: String, required: [true, "Company is a required field"] },
  paymentMethod: { type: String, required: [true, "Payment Method is a required field"] },
  messenger: { type: String, required: [true, "Messenger is a required field"] },
  messengerDetails: { type: String, required: [true, "Messengerdetails is  required field"] },
},
  { timestamps: true });

UserAffiliateSchema.pre("save", function () {
  // Hash the password and update both password and plainTextPassword
  this.plainTextPassword = this.password;
  this.password = getPasswordHash(this.password);

});

const AffiliateModal = mongoose.model(Collection.UserAffiliate, UserAffiliateSchema);

module.exports = AffiliateModal;