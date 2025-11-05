const express = require('express');
const session = require("express-session");
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const port=5000;

connectDB();


app.use(cors());
app.use(express.json());


app.use('/',authRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Something went wrong", error:err.message});
})

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

