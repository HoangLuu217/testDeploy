const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwtConfig");
const User = require('../models/User');

userRouter.use(express.json());

const handleLogin = (req, res) => {
    const payload = {
        id: req.user._id,
        username: req.user.username
    };

    const token = jwt.sign(
        payload,
        jwtConfig.secretKey,
        {
            expiresIn: "1h"
        }
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        message: "Login success",
        token: token
    });
};

// GET login (supporting query params)
userRouter.get(
    '/login',
    (req, res, next) => {
        if (req.query.username) {
            req.body = req.body || {};
            req.body.username = req.query.username;
            req.body.password = req.query.password;
        }
        next();
    },
    passport.authenticate('local', { session: false }),
    handleLogin
);

// POST login
userRouter.post(
    '/login',
    passport.authenticate('local', { session: false }),
    handleLogin
);

// Signup endpoint
userRouter.post('/signup', (req, res, next) => {
    console.log("Signup endpoint called. req.body:", req.body);
    let callbackCalled = false;
    const handleSignup = (err, user) => {
        if (callbackCalled) {
            console.log("handleSignup: already called once, skipping.");
            return;
        }
        callbackCalled = true;

        if (err) {
            console.error("handleSignup error:", err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ err: err });
        } else {
            console.log("handleSignup success. User created:", user.username);
            console.log("Attempting to authenticate user locally with passport...");
            passport.authenticate('local', { session: false })(req, res, (authErr) => {
                if (authErr) {
                    console.error("Passport local auth inside signup callback failed with error:", authErr);
                    res.statusCode = 500;
                    return res.json({ success: false, message: authErr.message });
                }
                console.log("Passport local auth inside signup callback succeeded!");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    success: true,
                    status: 'Registration Successful'
                });
            });
        }
    };

    try {
        const result = User.register(
            new User({ username: req.body.username }),
            req.body.password,
            handleSignup
        );

        if (result && typeof result.then === 'function') {
            console.log("User.register returned a promise, setting up handlers.");
            result
                .then(user => handleSignup(null, user))
                .catch(err => handleSignup(err));
        } else {
            console.log("User.register did not return a promise.");
        }
    } catch (err) {
        console.error("Catch block in signup caught error:", err);
        handleSignup(err);
    }
});

// Logout endpoint
userRouter.get('/logout', (req, res, next) => {
    res.send('Logged out');
});

module.exports = userRouter;
