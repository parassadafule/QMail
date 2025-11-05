const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required:true },
  qmail: { type: String, required:true, unique: true },
  password: { type: String, required:true },
  dateOfbirth: { type: Date },

}, { timestamps: true },);

module.exports = mongoose.model('User', userSchema);

