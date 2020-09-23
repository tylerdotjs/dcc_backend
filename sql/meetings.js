const db = require("./index")

module.exports.getMeetings = async(callback = function(){}) => {
    db.query("SELECT * FROM meetings LIMIT 10", (err, results, fields) => {
        if (err) throw err;
        callback(results);
    });
}
/**
 * 
 * @param {Date} date 
 * @param {String} description 
 * @param {String} location 
 */
module.exports.makeMeeting = async(date, description = null, location) => {

    db.query("INSERT INTO meetings VALUES ( ?, ?, ?)", [date, description, location], (err, results, fields) => {
        if (err) throw err;
    });
}