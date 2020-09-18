const fs = require('fs')
const bcrypt = require('bcrypt')
const db = require('../sql/index.js')
const uuid = require('uuid')

module.exports.checkPassword = (user, password) => {
    console.log(user, password)
    return bcrypt.compareSync(password, user.password)
}

module.exports.getUserByID = () => {

}
module.exports.getUserByName = (name, callback) => {
    db.connect()
    db.query("SELECT * FROM users WHERE name = " + db.escape(name), function (err, result, fields) {
        if (err) throw err;
        callback(result[0])
    })
    db.end()
}
module.exports.getUserByEmail = () => {

}
module.exports.createUser = (name, email, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err

        db.connect()
        db.query("INSERT INTO users VALUES (? , ?, ?, ?)", [uuid.v4(), name, email, hash], (err, result, fields) => {
            if (err) throw err
            callback(201)
        })
        db.end()

    })
}