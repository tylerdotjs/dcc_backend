const mongoose = require('mongoose')
const config = require('../config')

const schema =  new mongoose.Schema({
    username: String,
    name: { type: String, default: "John Doe"},
    roles: [String],
    date: { type: Date, default: Date.now },
    profilePicture: { type: String, default: config.defaultProfilePic}
});
  

module.exports = mongoose.model('profiles', schema);