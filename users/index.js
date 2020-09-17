const fs = require('fs')
const bcrypt = require('bcrypt')

var users = JSON.parse(fs.readFileSync('./users/users.json'))
console.log(users)

async function saveToUsersJSON(content) {
    var raw = JSON.stringify(content)
    fs.writeFileSync('./users/users.json', raw)
}

module.exports.checkPassword = (user, password) => {
    return bcrypt.compareSync(password, user.passwordHash)
}

module.exports.getUserByID = () => {

}
module.exports.getUserByName = (name) => {
    user = users.find(element => element.name == name)
    return user
}
module.exports.getUserByEmail = () => {

}
module.exports.createUser = (name, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
        if(err) throw err
        var user = {}
        user.name = name
        user.passwordHash = hash
        console.log(user)
        users.push(user)
        saveToUsersJSON(users)
        callback(201)
    })
}