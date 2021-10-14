var mysql = require('mysql');

console.log("đang connect")

var connection = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3444338',
    password: 'FC5bglUe2Q',
    database: 'sql3444338',
    port: '3306',
    multipleStatements: true
});

connection.connect(
    function(err){
        if(err) throw err;
        console.log("thanh cong")
    }
);
module.exports = connection;