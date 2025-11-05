const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  email_id: { type: String, required: true, unique: true }, // Custom email ID
  sender: { type: String, required: true },                 // Sender's email
  to: { type: String, required: true },                     // Recipient's email
  encrypted_subject: { type: String, required: true },      // Encrypted subject
  encrypted_body: { type: String, required: true },
  file_name: { type: String },
  file_hex: { type: String },
  key: { type: String, required: true },
  qber: { type: Number, required: true },                   
  is_read: { type: Boolean, default: false },               
  createdAt: { type: Date, default: Date.now }   
});

module.exports = mongoose.model('Email', emailSchema); 