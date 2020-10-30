const { Mongoose } = require("mongoose");

const mongoose = require('mongoose')
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://dev:HN9bOJptqAljADyb@website.gpnvo.mongodb.net/dev?retryWrites=true&w=majority', options)