const express = require('express')
const passport = require('passport')
const account = require('../users/createDelete')
const profileModel = require('../models/profiles')

const app = express.Router()
app.use(passport.authenticate('session'))

app.get('/', async (req, res) => {
    if(!req.user) return res.sendStatus(401)
    return res.send(req.user)
})
app.delete('/', async (req, res) => {
    req.logOut()
    account.delete(req.user._id)
    return res.sendStatus(200)
})
app.delete('/:id', (req, res) => {
    if(!req.user) return res.sendStatus(401)
    else if(req.user.roles.includes('admin')){
        account.delete(req.user._id)
        return res.sendStatus(200)
    } else if (req.user._id == req.params.id) {
        req.logOut()
        account.delete(req.user._id)
        return res.sendStatus(200) 
    }
    return res.sendStatus(403)
})
app.get('/:id', async (req, res) => {
    profileModel.findById(req.params.id)
        .then(data => res.send(data))
})
app.get('/:id/:prop', async (req, res) => {
    profileModel.findById(req.params.id).select(req.params.prop)
        .then(data => res.send(data))
})

module.exports = app;