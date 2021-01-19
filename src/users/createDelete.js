const passport = require('passport')
const bcrypt = require('bcrypt')
const config = require('../config')
const usersModel = require('../models/users')
const profileModel = require('../models/profiles')

module.exports = {
    async create(options) {
        return usersModel.find({ $or: [{ 'email': options.email }, { 'username': options.username }] }).select('-hash').exec()
            .then((results) => {
                if (results.length > 0) {
                    if (results[0].email == options.email) {
                        return Promise.reject("Email Already In Use")
                    }
                    if (results[0].username == options.username) {
                        return Promise.reject("Username Already In Use")
                    }
                }
            })
            .then(() => { return bcrypt.hash(options.password, config.passport.saltRounds) })
            .then(hash => {
                options.hash = hash
                return usersModel.create(options)
            })
            .then(doc => {
                options._id = doc._id
                return profileModel.create(options)
            })
    },
    async delete(id) {
        return usersModel.findByIdAndDelete(id)
        .then(profileModel.findByIdAndDelete(id))
    }
}