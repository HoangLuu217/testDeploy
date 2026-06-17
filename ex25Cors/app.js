const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

require("./authentication/passportLocal");
require("./authentication/passportJWT");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

mongoose.connect("mongodb://127.0.0.1:27017/ex25")
    .then(() => {
        console.log("Connected MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.use('/users', require('./authentication/userRouter'));
app.use('/articles', require('./routes/articleRouter'));

module.exports = app;
