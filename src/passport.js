const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bycrypt = require('bcrypt')
const dbModel = require('./models/users')
const profileModel = require('./models/profiles')

passport.use(new LocalStrategy(
  function (username, password, done) {
    dbModel.findOne({ 'username': username }, function (err, user) {
      if(err) throw err
      if(user == null || user == undefined) {
        return done(null, false)
      }
      bycrypt.compare(password, user.hash, function (err, result) {
        if(err) throw err
        if (result) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    })
  }));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (user, done) {
  profileModel.findById(user)
    .then(data => done(null, data))
    .catch(err => done(err))
});

passport.useRole = function(_role) 
{
  return function (req, res, next){
    let role = _role
    if (req.user === undefined) return res.sendStatus(401);
    if (req.user.roles.includes(role)) {
      return next()
    }
    return res.sendStatus(401)
  }
}