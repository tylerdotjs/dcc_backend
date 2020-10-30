const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
require('./passport.js')
const dbModel = require('./dbModel')

const frontendLocation = " http://172.17.24.253:8080/"
const saltRounds = 12;

app = express.Router()

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {
    successRedirect: '/#/',
    failureRedirect: '/#/login'
}));


app.post('/register', (req, res) => {
    let b = req.body;
    if(!b.username || !b.email || !b.password){
        res.sendStatus(403)
    }
    bcrypt.hash(b.password, saltRounds, function(err, hash) {
        if (err) throw err;
        dbModel.create({username: b.username, email: b.email, hash: hash}, function (err) {
            if (err) throw err;
            res.sendStatus(201)
        })
    });
});

module.exports = app;