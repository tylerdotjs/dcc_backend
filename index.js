const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const user = require('./user/express.js')
const events = require('./events/express')
const config = require('./config')
const MongoStore = require('connect-mongo')(session);

require("./mongoose")
const mongoose = require('mongoose')

if(!config.frontendLocation) {
    config.frontendLocation = '/#'
}

const cors = require('cors')

const port = 8080
const app = express()

app.use(cors({origin: config.frontendLocation, credentials: true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: config.passportSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use("/", user)
app.use("/events", events)

app.listen(port, () => {
    console.log(`App listing at http://localhost:${port}`)
    
})
