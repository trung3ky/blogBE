const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connection = require('./controller/db')
const cors = require('cors')
const moment = require('moment'); 
 
app.use(bodyParser());
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World')
})

// log in
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

// register
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


app.get('/blog', function (req, res) {
    const blogSql = `SELECT blog.*, cmt.*, user.name, user.image, count.count_cmt
    FROM blog INNER JOIN 
        (SELECT comment.* FROM comment INNER JOIN (SELECT MAX(id_comment) AS id_max 
        FROM comment GROUP BY id_of_post) AS c ON comment.id_comment = c.id_max) AS cmt 
    ON blog.id_post = cmt.id_of_post 
    INNER JOIN user ON user.id = cmt.id_user_comment 
    INNER JOIN (SELECT id_of_post, COUNT(id_comment) as count_cmt FROM comment
    GROUP BY id_of_post) AS count
    ON blog.id_post = count.id_of_post`
    connection.query(blogSql, (err, resultsBlog) => {
        if(err) throw err;

        if(resultsBlog.length < 0){
            res.json({type : "null"})
        }else{
            res.json({type: "success", data: resultsBlog})
        }
    })
})

app.get('/user&iduser=:id' , function(req, res) {
    var idUser = req.params.id
    const userSql = `select * from user where id = ${idUser}`
    connection.query(userSql, (err, results) => {
        if(err) throw err;

        if(results.length > 0){
            res.json({type : "success", data: results[0]})
        }
    })
})


app.post("/add-post", function(req, res) {
    const idUserPost = req.body.idUserPost
    const contentPost = req.body.contentPost
    const statusPost = req.body.statusPost
    const imagePost = req.body.imagePost
    const timePost = TimeNow()

    // const m = moment().format()
    // const m = moment(imagePost).toNow(true)
    console.log(m)

    console.log(imagePost)
    
})

function TimeNow(){
    const date = new Date()

    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);

    const timePosst = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + hours + ":" + minutes + ":" + seconds

    return timePosst
}


 
app.listen(process.env.PORT, () => {
    console.log('JSON Server is running');
})
