const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connection = require('./controller/db')
const cors = require('cors')
 
app.use(bodyParser());
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World')
})


app.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const signInSql = `select * from user where email = "${email}" and password = "${password}"`;

    connection.query(signInSql, (err, results) => {
        if(err) throw err;
        console.log(results)
        if(results.length > 0) {
            res.json({
                type: 'success',
                data: results[0]
            })
        }else{
            res.json({
                type: 'error',
            })
        }
    })
})


app.post('/register', (req, res) => {
    const {name, email, password, date, gender} = req.body;
    const d = new Date();
    const startDate = `${d.getFullYear()}:${d.getMonth()}:${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

    const insertUser = `INSERT INTO user 
    (name, password, address, email, gender, description, image, startDate, birthday) 
    Values ("${name}", "${password}", "", "${email}", "${gender}", "", "", "${startDate}", "${date}")`;

    connection.query(insertUser, (err, results) => {
        if(err) throw err;
        
        res.json(
            {
                type: "success",
                data: req.body
            }
        )
    })
})

 
app.listen(3001)
