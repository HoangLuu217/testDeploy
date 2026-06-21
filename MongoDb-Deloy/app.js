const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config();
require("./authentication/passportLocal");
require("./authentication/passportJWT");
const url = process.env.mongoDB_URL;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

mongoose.connect(url)
    .then(() => {
        console.log("Connected MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use('/users', require('./authentication/userRouter'));
app.use('/articles', require('./routes/articleRouter'));

module.exports = app;
