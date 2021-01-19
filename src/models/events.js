const mongoose = require('mongoose');
const { mongo } = require('../config');

const schema =  new mongoose.Schema({
    subject: String,
    description: String,
    location: String,
    roles: [String],
    attendees: [{type: mongoose.Types.ObjectId, ref: "profiles"}],
    date: { type: Date, default: Date.now },
});
  

module.exports = mongoose.model('events', schema);