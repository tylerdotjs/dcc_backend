const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bycrypt = require('bcrypt')
// requires the model with Passport-Local Mongoose plugged in
const db = require('mongoose')
const dbModel = require('./dbModel')

passport.use(new LocalStrategy(
  function (username, password, done) {
    dbModel.findOne({ 'username': username }, function (err, user) {
      if(err) throw err
      bycrypt.compare(password, user.hash, function (err, result) {
        if(err) throw err
        if (result) {
          done(null, user)
        } else {
          done(null)
        }
      })
    })
  }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});