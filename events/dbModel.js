const mongoose = require('mongoose')

const eventSchema =  new mongoose.Schema({
    subject: String,
    description: String,
    location: String,
    roles: [String],
    attendees: [mongoose.Schema.Types.ObjectId],
    date: { type: Date, default: Date.now },
});
  

module.exports = mongoose.model('EventShema', eventSchema, 'events');