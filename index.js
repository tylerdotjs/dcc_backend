const express = require('express')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const user = require('./user/express.js')
require("./mongoose")


const cors = require('cors')

const port = 8081
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: 'pioFKLJaklsl',
    resave: false,
    saveUninitialized: false
}));
app.use(cors({credentials: true, origin: 'http://172.17.24.253:8080'}))

app.use("/", user)

app.listen(port, () => {
    console.log(`App listing at http://localhost:${port}`)
})