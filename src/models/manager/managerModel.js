const mongoose = require('mongoose');
const Collection = require('../../config/collection');
const { getPasswordHash } = require('../../utils/password');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
  fullName: { type: String, required: [true, "Fullname is required field"] },
  lastName: { type: String, required: [true, "Lastname is required field"] },
  email: { type: String, required: [true, "Email is required field"], unique: true, },
  password: { type: String, required: [true, "Password is required field"] },
  skipeId: { type: String, required: [true, "SkipeId is required field"] },
  profilePic: { type: String, required: [true, "ProfilePic is required field"] },
  whatsapp: { type: String, required: [true, "Whatsapp is required field"] },
  message: { type: String, required: [true, "Message is required field"] },
  linkedIn: { type: String },
  telegram: { type: String, required: [true, "Telegram is required field"] },
},
{
  timestamps: true
});


managerSchema.pre("save", function () {
  this.plainTextPassword = this.password;
  this.password = getPasswordHash(this.password);
});



const ManagerModal = mongoose.model(Collection.Manager, managerSchema);

module.exports = ManagerModal;