const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: body
        };

        const info = await transporter.sendMail(mailOptions);
        return {
            status: 'success',
            messageId: info.messageId
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            status: 'error',
            error: error.message
        };
    }
};

const storeEmail = async (emailData, db) => {
    try {
        const result = await db.collection('emails').insertOne(emailData);
        return {
            success: true,
            emailId: result.insertedId
        };
    } catch (error) {
        console.error('Error storing email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendEmail,
    storeEmail
}; 