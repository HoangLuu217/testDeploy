const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
require("./authentication/passportLocal");
require("./authentication/passportJWT");
const url = process.env.mongoDB_URL;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

// Page routes
app.get('/', (req, res) => {
    res.render('dashboard');
});
app.get('/login', (req, res) => {
    res.render('login');
});

// API routes
app.use('/users', require('./authentication/userRouter'));
app.use('/articles', require('./routes/articleRouter'));

module.exports = app;
