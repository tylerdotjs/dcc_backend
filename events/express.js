const express = require('express');
const passport = require('passport');
const dbModel = require('./dbModel')
const userModel = require("../user/dbModel")

const app = express.Router()

app.use(passport.authenticate('session'))

app.get('/', (req, res) => {
    dbModel.find()
        .sort('-date')
        .exec((err, result) => {
            if (err) throw err;
            if (!req.user) return res.sendStatus(401)
            var data = {
                isAdmin: false,
                events: []
            }
            if (req.user.roles.includes("admin")) {
                data.isAdmin = true;
            }
            var complatedQuerys = 0
            result.forEach((e, index) => {
                userModel.find({
                    '_id': { $in: e.attendees }
                })
                    .exec((err, users) => {
                        if (err) throw err;
                        var usersClean = []
                        users.forEach((el, userI) => {
                            usersClean[userI] = {
                                _id: el._id,
                                username: el.username
                            }
                        })
                        data.events[index] = {
                            _id: e._id,
                            subject: e.subject,
                            description: e.description,
                            date: e.date,
                            attending: e.attendees.includes(req.user._id),
                            location: e.location,
                            peers: usersClean
                            
                        }
                        complatedQuerys++
                        if (complatedQuerys >= result.length) {
                            return res.send(data)
                        }
                    })
            })
        })
})
app.post('/add', passport.useRole("admin"), (req, res) => {
    dbModel.create({ subject: req.body.subject, description: req.body.description, date: req.body.date, location: req.body.location }, (err) => {
        if (err) throw err
        return res.sendStatus(201)
    })
})
app.post('/join', (req, res) => {
    if (!req.body.id) return res.sendStatus(403)
    if (!req.user) return res.sendStatus(401)
    dbModel.updateOne({ _id: req.body.id }, { $push: { attendees: req.user._id } }, (err, response) => {
        if (err) throw err
        res.sendStatus(200)
    })
})
app.post('/cancel', (req, res) => {
    if (!req.body.id) return res.sendStatus(403)
    if (!req.user) return res.sendStatus(401)
    dbModel.updateOne({ _id: req.body.id }, { $pullAll: { attendees: [req.user._id] } }, (err, response) => {
        if (err) throw err
        res.sendStatus(200)
    })
})
module.exports = app;