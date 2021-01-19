const express = require('express');
const passport = require('passport')
const account = require('../users/createDelete')

const app = express.Router()

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200)
});
app.post('/register', async (req, res) => {
    if(!req.body || !req.body.username || !req.body.email || !req.body.password) res.status(400).send("missing required field(s)")
    account.create(req.body)
    .then(data => {
        req.login(data, (err) => {
            if(err) throw err
            res.send(data)
        })
    })
    .catch(err => {
        res.status(400).send(err)
    })
});
app.get('/logout', passport.authenticate('session'),(req, res) => {
    console.log('test')
    req.logout()
    req.session.destroy((err) => {
        if (err) res.status(500).send(err)
        console.log('logout')
        return res.clearCookie('connect.sid').send('logged out')
    })
})

module.exports = app