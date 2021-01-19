const express = require('express');
const passport = require('passport');
const dbModel = require('../models/events')

const app = express.Router()

app.use(passport.authenticate('session'))
app.use((req, res, next) => {
    if(req.user){
        return next()
    } else {
        return res.sendStatus(401)
    }
})

app.get('/', (req, res) => {
    dbModel.find().populate("attendees", "username")
        .then(data => res.send(data))
        .catch(err => res.send(err))
})
app.get('/:id', (req, res) => {
    dbModel.findById(req.params.id).populate("attendees", "username")
        .then(data => res.send(data))
        .catch(err => res.send(err))
})
app.post('/:id/attend', async (req, res) => {

    dbModel.updateOne({ _id: req.params.id }, { $push: { attendees: req.user._id } })
    .then(data => res.send(data))
})
app.delete('/:id/attend', async (req, res) => {
    dbModel.updateOne({ _id: req.params.id }, { $pullAll: { attendees: [req.user._id] } })
    .then(data => res.send(data))
})
app.post('/:id/attend/:user', passport.useRole("admin"), async (req, res) => {

    dbModel.updateOne({ _id: req.params.id }, { $push: { attendees: req.params.user } })
    .then(data => res.send(data))
})
app.delete('/:id/attend/:user', passport.useRole("admin"), async (req, res) => {
    dbModel.updateOne({ _id: req.params.id }, { $pullAll: { attendees: [req.params.user] } })
    .then(data => res.send(data))
})
//Make event
app.post('/', passport.useRole("admin"), async (req, res) => {
    if(!req.body) return res.sendStatus(400)
    dbModel.create(req.body)
        .then(data => res.send(data))
})
app.put('/:id', passport.useRole("admin"), async (req, res) => {
    if(!req.body) return res.sendStatus(400)
    dbModel.findByIdAndUpdate(req.params.id, body)
        .then(data => res.send(data))
})
app.delete('/:id', passport.useRole("admin"), async (req, res) => {
    dbModel.findByIdAndDelete(req.params.id)
        .then(data => res.send(data))
})
module.exports = app;