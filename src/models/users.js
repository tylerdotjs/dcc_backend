const mongoose = require('mongoose')
const schema =  new mongoose.Schema({
    username: String,
    email: String,
    hash: String,
});
  

module.exports = mongoose.model('users', schema);