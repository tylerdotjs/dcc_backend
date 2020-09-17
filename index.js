const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const userData = require('./users/index')

const port = 8081
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function (username, password, done) {
        const user = userData.getUserByName(username)
        console.log(user)
        if (userData.checkPassword(user, password)){
            done(null, user)
        } else {
            done(null)
        }
    }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.post('/login',

    passport.authenticate('local'),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.send(200)
});
app.post('/join', (req, res) => {
    userData.createUser(req.body.username, req.body.password, (message) => {
        res.send(message)
    })
})

app.listen(port, () => {
    console.log(`App listing at http://localhost:${port}`)
})