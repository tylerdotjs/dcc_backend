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

const cors = require('cors')

const port = 8080
const app = express()

app.use(cors({origin: function (origin, callback) {
    // bypass the requests with no origin (like curl requests, mobile apps, etc )
    if (!origin) return callback(null, true);
 
    if (config.cors.indexOf(origin) === -1) {
      var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }, credentials: true}))
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
