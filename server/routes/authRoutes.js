const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Email = require("../models/emailSchema");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// const emailSchema = new mongoose.Schema({
//     to: String, 
//     from: String,
//     subject: String,
//     body: String,
//     key: String, // Store key as hex
//     qber: Number,
//     file_name: String,
//     file_hex: String,
//     createdAt: { type: Date, default: Date.now },
//     isRead: { type: Boolean, default: false },
//   });
//   const Email = mongoose.model('Email', emailSchema);

require("dotenv").config();


router.post("/signup", async (req, res) => {
    const { Qmailid, email, password } = req.body;
    console.log("Received signup request:", { Qmailid, email });

    if (!Qmailid || !email || !password) {
        return res.status(400).json({ 
            message: "All fields are required",
            missing: {
                Qmailid: !Qmailid,
                email: !email,
                password: !password
            }
        });
    }

    try {
        const userExists = await User.findOne({ Qmailid });
        if (userExists) {
            return res.status(400).json({ message: "Qmailid already exists" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            Qmailid, 
            email, 
            password: hashedPassword 
        });

        const savedUser = await user.save();
        console.log("User saved successfully:", savedUser);

        res.status(201).json({ 
            message: "User registered successfully",
            user: {
                Qmailid: savedUser.Qmailid,
                email: savedUser.email
            }
        });
    } catch (error) {
        console.error("Signup Error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error",
                errors: error.errors 
            });
        }
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
});


router.post("/login", async (req, res) => {
    const { Qmailid, password } = req.body;

    try {
        const user = await User.findOne({ Qmailid });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Invalid Qmailid or password" });
        }

        const token = jwt.sign({ 
            id: user._id,
            email: user.email,
            Qmailid: user.Qmailid
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ 
            message: "Login successful", 
            token,
            email: user.email,
            Qmailid: user.Qmailid
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.json({
            email: user.email,
            Qmailid: user.Qmailid
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/inbox", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    const inboxEmails = await Email.find({ to: userEmail })
      .sort({ createdAt: -1 })
      .select('from to subject body isRead createdAt _id');

    return res.json({ 
      inbox_emails: inboxEmails || [],
      message: inboxEmails.length === 0 ? "No emails found" : "Emails retrieved successfully"
    });
  } catch (error) {
    console.error("Inbox Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
});

router.get("/sent", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ message: "User email not found in token" });
    }

    const sentEmails = await Email.find({ from: userEmail })
      .sort({ createdAt: -1 })
      .select('from to subject body isRead createdAt _id');

    return res.json({ 
      sent_emails: sentEmails || [],
      message: sentEmails.length === 0 ? "No sent emails found" : "Sent emails retrieved successfully"
    });
  } catch (error) {
    console.error("Sent Emails Error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
});

// Send email endpoint
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

router.post('/send', authenticateToken, upload.single('file'), async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      const from = req.user.email; // Sender from JWT
      const file = req.file; // Uploaded file
  
      if (!to || !subject || !body) {
        return res.status(400).json({
          error: 'Email data with to, subject, and body is required',
        });
      }
  
      // Calculate key length (mimicking Flask)
      const subjectLength = Buffer.from(subject, 'utf-8').length;
      const bodyLength = Buffer.from(body, 'utf-8').length;
      let key_length = Math.max(128, Math.max(subjectLength, bodyLength) * 8);
  
      let file_content = null;
      let file_name = null;
      let file_hex = null;
      if (file) {
        file_content = require('fs').readFileSync(file.path); // Read file
        key_length += file_content.length;
        file_name = file.filename;
      }
  
      // Generate quantum key (replace with actual implementation)
    //   const { key, qber } = await generate_quantum_key({ key_length, eavesdropping: false });
      const { key, qber } = await qkd_service.generate_quantum_key({ key_length, eavesdropping: false });
  
      // Encrypt file if present
      if (file) {
        const file_key_offset = subjectLength + bodyLength;
        file_hex = encrypt_file(file_content, key.slice(file_key_offset));
      }
  
      // Encrypt email data
      const email_data = { to, subject, body, from };
      const encrypted_email = encryption_service.encrypt_email(email_data, key);
  
      // Store in MongoDB
      const email_doc = new Email({
        to,
        from,
        subject: encrypted_email.subject,
        body: encrypted_email.body,
        key: key.toString('hex'), // Store as hex
        qber,
        file_name,
        file_hex,
        isRead: false,
      });
      const savedEmail = await email_doc.save();
  
      // Send email
      let body_with_file = encrypted_email.body;
      if (file_hex) {
        body_with_file += `\n\nAttachment (hex): ${file_hex.slice(0, 50)}... (download via API)`;
      }
      const result = await send_email({
        encrypted_body: body_with_file,
        to,
        subject: encrypted_email.subject,
      });
  
      if (result.status === 'error') {
        return res.status(500).json({ error: result.error });
      }
  
      // Response matching Flask
      res.status(200).json({
        encrypted_email,
        qber,
        status: result.status,
        email_id: savedEmail._id.toString(),
        file_name,
      });
    } catch (error) {
      console.error('Send Email Error:', error);
      res.status(500).json({
        error: `Server error: ${error.message}`,
      });
    }
  });

// Get email by ID
router.get("/email/:id", authenticateToken, async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check if user has access to this email
    if (email.to !== req.user.email && email.from !== req.user.email) {
      return res.status(403).json({ message: "Unauthorized access to email" });
    }

    // Mark as read if recipient is viewing
    if (email.to === req.user.email && !email.isRead) {
      email.isRead = true;
      await email.save();
    }

    return res.json({ email });
  } catch (error) {
    console.error("Get Email Error:", error);
    return res.status(500).json({
      message: "Failed to fetch email",
      error: error.message
    });
  }
});

module.exports = router; 