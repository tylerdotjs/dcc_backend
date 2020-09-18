const mysql = require('mysql')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync('./sql/config.json'))

var connection = mysql.createConnection(config)

module.exports = connection