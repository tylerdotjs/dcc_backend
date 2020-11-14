const express = require('express');
const passport = require('passport');
const dbModel = require('./dbModel')

const app = express.Router()

app.use(passport.authenticate('session'))

app.get('/', (req, res) => {
    dbModel.find((err, result) => {
        if (err) throw err;
        let isAdmin = false;
        if(!req.user) return res.sendStatus(401)
        if(req.user.roles.includes("admin")){
            isAdmin = true;
        }
        res.send({'events': result, 'isAdmin': isAdmin})
    })
})
app.post('/add', passport.useRole("admin"), (req, res) => {
        dbModel.create({subject: req.body.subject, description: req.body.description, date: req.body.date, location: req.body.location}, (err) => {
            if(err) throw err
            return res.sendStatus(201)
        })
})
module.exports = app;