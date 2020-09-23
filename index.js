const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const userData = require('./users/index')
const meetings = require('./sql/meetings')

const port = 8081
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function (username, password, done) {
        userData.getUserByName(username, (user) => {
            if (userData.checkPassword(user, password)) {
                done(null, user)
            } else {
                done(null)
            }
        })
    }
));
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.post('/login',

    passport.authenticate('local'),
    function (req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.sendStatus(200)
    });
app.post('/join', (req, res) => {
    console.log(req.body)
    if (req.body.username && req.body.email && req.body.password) { // Checking if all values exsist
        userData.createUser(req.body.username, req.body.email, req.body.password, (message) => {
            res.sendStatus(message)
        })
    } else {
        res.sendStatus(400)
    }
})
app.get('/meetings', (req, res) => {
    meetings.getMeetings((resault) => {
        res.send(resault)
    })
})

app.listen(port, () => {
    console.log(`App listing at http://localhost:${port}`)
})