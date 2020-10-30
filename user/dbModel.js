const mongoose = require('mongoose')
const UserSchema =  new mongoose.Schema({
    username: String,
    email: String,
    hash: String,
    roles: [String],
    date: { type: Date, default: Date.now },
});
  

module.exports = mongoose.model('User', UserSchema, 'users');