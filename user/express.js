const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
require('./passport.js')
const dbModel = require('./dbModel')
const config = require('../config.js')

const saltRounds = 12;

app = express.Router()

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200)
});

app.post('/register', (req, res) => {
    let b = req.body;
    if (!b.username || !b.email || !b.password) {
        return res.sendStatus(403)
    }
    dbModel.find({ $or: [{ 'email': b.email }, { 'username': b.username }] }, (err, results) => {
        if (err) throw err
        if (results.length > 0) {
            if (results[0].email == b.email) {
                return res.status(403).send('Email Already Registered')
            }
            if (results[0].username == b.username) {
                return res.status(403).send('Username Already Registered')
            }
        }
        else {
            bcrypt.hash(b.password, saltRounds, function (err, hash) {
                if (err) throw err;
                dbModel.create({ username: b.username, email: b.email, hash: hash }, function (err) {
                    if (err) throw err;
                    return res.sendStatus(201)
                })
            });
        }
    })

});

module.exports = app;