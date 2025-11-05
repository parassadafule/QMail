const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Email = require("../models/emailSchema");
const multer = require("multer");
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const axios = require('axios');
const path = require("path");
const router = express.Router();

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token. Login again" });
    }
    req.user = user;
    next();
  });
};

router.post("/signup", async (req, res) => {
  const { fullName, qmail, password } = req.body;
  console.log("Received signup request:", { fullName, qmail, password });

  if (!fullName || !qmail || !password) {
    return res.status(400).json({
      message: "All fields are required",
      missing: {
        fullName: !fullName,
        qmail: !qmail,
        password: !password
      }
    });
  }

  try {
    const emailExists = await User.findOne({ qmail });
    if (emailExists) {
      return res.status(400).json({ message: "Qmail already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      qmail,
      password: hashedPassword
    });

    const savedUser = await user.save();
    console.log("User saved successfully:", savedUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        fullName: savedUser.fullName,
        qmail: savedUser.qmail
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
  const { qmail, password } = req.body;

  try {
    const user = await User.findOne({ qmail });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid qmail or password" });
    }

    req.session = req.session || {};
    req.session.smtpPassword = password;

    const token = jwt.sign({
      sub: user.qmail,
      id: user._id,
      qmail: user.qmail,
      fullName: user.fullName
    }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      qmail: user.qmail,
      fullName: user.fullName
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
      qmail: user.qmail,
      fullName: user.fullName
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/inbox", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.qmail;
    // console.log("User email from token:", userEmail);
    if (!userEmail) {
      return res.status(400).json({ message: "User qmail not found in token" });
    }
    const inboxEmails = await Email.find({ to: userEmail });
    // console.log("Inbox emails found:", inboxEmails.length);
    return res.json({
      emails: inboxEmails || [],
      message: inboxEmails.length === 0 ? "No emails found" : "Emails retrieved successfully"
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/sent", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.qmail;
    if (!userEmail) {
      return res.status(400).json({ message: "User qmail not found in token" });
    }

    const sentEmails = await Email.find({ sender: userEmail })
      .sort({ createdAt: -1 })
      .lean(); 

    return res.json({
      emails: sentEmails || [],
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ dest: 'uploads/' });

router.post('/send', authenticateToken, upload.single('file'), async (req, res) => {
  let filePath = null;
  try {
    const { to, subject, body } = req.body;
    const file = req.file;

    // const emailExists = await User.findOne({ qmail: to });
    // if (!emailExists) {
    //   return res.status(400).json({ error: 'Recipient qmail does not exist' });
    // }

    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Email data with to, subject, and body is required',
      });
    }

    console.log('Received:', { to, subject, body, file: file?.originalname });

    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('body', body);

    if (file) {
      filePath = file.path;
      const fileStream = fs.createReadStream(filePath);
      formData.append('file', fileStream, file.originalname);
    }

    // console.log("File exists at:", filePath, fs.existsSync(filePath));
    // console.log("File size:", fs.statSync(filePath).size);

    const token = req.headers['authorization'].split(' ')[1];

    console.log('Sending to Flask:', { to, subject, body, file: file?.originalname });

  
    let flaskRes;
    try {
      flaskRes = await axios.post('http://localhost:8000/encrypt', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...formData.getHeaders(),
        },
      });
    } catch (axiosError) {
      console.error('Axios error:', axiosError.message, axiosError.stack);
      if (axiosError.response) {
        console.error('Flask response:', axiosError.response.data, axiosError.response.status);
        return res.status(axiosError.response.status).json({
          error: axiosError.response.data.error || 'Flask server error',
          details: axiosError.response.data,
        });
      }
      throw new Error(`Failed to connect to Flask: ${axiosError.message}`);
    }

    const flaskData = flaskRes.data;
    console.log('Flask response:', flaskData);

    if (flaskRes.status !== 200) {
      console.error('Flask non-200 response:', flaskData);
      return res.status(flaskRes.status).json({ error: flaskData.error || 'Flask server error' });
    }

    res.status(200).json({
      encrypted_email: flaskData.encrypted_email,
      qber: flaskData.qber,
      status: flaskData.status,
      email_id: flaskData.email_id,
      file_name: flaskData.file_name,
    });
  } catch (error) {
    console.error('Send Email Error:', error.message, error.stack);
    return res.status(500).json({
      error: `Server error: ${error.message}`,
    });
  } finally {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('File cleanup error:', cleanupError);
      }
    }
  }
});

router.post('/decrypt', authenticateToken, async (req, res) => {
  try {
    const { emailId } = req.body;
    console.log("Decrypt request received for emailId:", emailId);
    const token = req.headers.authorization?.split(' ')[1];

    if (!emailId) {
      return res.status(400).json({ message: 'Email ID is required' });
    }

    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const flaskRes = await axios.post('http://localhost:8000/decrypt', {
      _id: emailId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const flaskData = flaskRes.data;

    if (flaskRes.status !== 200) {
      console.error('Flask non-200 response:', flaskData);
      return res.status(flaskRes.status).json({ error: flaskData.error || 'Flask server error' });
    }

    console.log('Flask decryption response:', flaskData);
    
    res.status(200).json({
      message: 'Decryption successful',
      decryptedContent: {
        subject: flaskData.decryptedContent.decrypted_subject,
        body: flaskData.decryptedContent.decrypted_body,
        file: flaskData.decryptedContent.file || null,
      },
      status: flaskData.status,
      email_id: email._id,
    });

  } catch (error) {
    console.error('Decrypt Error:', error.message, error.stack);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});


router.get('/qmail/:id', authenticateToken, async (req, res) => {
  try {
    const email = await Email.findById(req.params.id).lean();
    if (!email) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (email.to !== req.user.qmail && email.sender !== req.user.qmail) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ email });
  } catch (err) {
    console.error('Error fetching email:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/download/:email_id', authenticateToken, async (req, res) => {
  const emailId = req.params.email_id;
  const token = req.headers['authorization'].split(' ')[1];
  try {
    const flaskResponse = await axios.get(`http://localhost:8000/download/${emailId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Disposition', flaskResponse.headers['content-disposition']);
    res.setHeader('Content-Type', flaskResponse.headers['content-type']);

    flaskResponse.data.pipe(res);

  } catch (error) {
    console.error("Download error:", error.message);
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.error || "Download failed"
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/trash', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.qmail;
    if (!userEmail) {
      return res.status(400).json({ message: "User qmail not found in token" });
    }

    const trashEmails = await Email.find({ to: userEmail, isDeleted: true })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      emails: trashEmails || [],
      message: trashEmails.length === 0 ? "No deleted emails found" : "Deleted emails retrieved successfully"
    });
  } catch (error) {
    console.error("Trash Emails Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;