var mysql = require('mysql');

console.log("đang connect")

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myblog',
    multipleStatements: true
});

connection.connect(
    function(err){
        if(err) throw err;
        console.log("thanh cong")
    }
);
module.exports = connection;