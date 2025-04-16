const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  from: { 
    type: String, 
    required: true 
  },
  to: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  body: { 
    type: String, 
    required: true 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  attachments: [{
    filename: String,
    path: String,
    size: Number
  }]
});

module.exports = mongoose.model('Email', emailSchema); 