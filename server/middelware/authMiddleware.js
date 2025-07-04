const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
require('dotenv').config();

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authenticateJWT;