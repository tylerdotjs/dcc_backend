const mongoose = require('mongoose')

const schema =  new mongoose.Schema({
    title: String,
    desc: String,
    owner: mongoose.Types.ObjectId,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  

module.exports = mongoose.model('images', schema);