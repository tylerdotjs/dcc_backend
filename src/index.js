const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const morgan = require('morgan')
const config = require('./config')
const port = 8080
const cors = require('cors')

const mongoose = require('mongoose')
require("./mongoose")
const MongoStore = require('connect-mongo')(session);

const app = express()

app.use(cors({
    origin: config.origin,
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(session({
    secret: config.passport.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

const passport = require('passport')
require('./passport')
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());

//app.use(morgan(':response-time'));

const auth = require('./routes/auth')
const events = require('./routes/events')
const user = require('./routes/user')
const images = require('./routes/images')

app.use("/auth", auth)
app.use("/events", events)
app.use("/user", user)
app.use("/images", images)

app.get("/", (req, res) => {
    res.send("Welcome to the SNEC API!")
})

app.listen(port, () => {
    console.log(`App listing at http://localhost:${port}`)

})
