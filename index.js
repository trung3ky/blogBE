const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connection = require('./controller/db')
const cors = require('cors')
const moment = require('moment'); 
const multer = require('multer')

const User = require('./modal/user')
const Blog = require('./modal/blog')

app.use('/assets', express.static(__dirname + "/public"));
app.use(bodyParser());
app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World')
})

// log in
app.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findAll({
        where: {
          "email": email,
          "password": password
        }
    });

    if(user.length > 0){
        res.json({
            type: 'success',
            data: user[0].dataValues
        })
    }
    else{
        res.json({
            type: 'error',
        })
    }
})

// register
app.post('/register', async (req, res) => {
    const {name, email, password, date, gender, image} = req.body;
    const d = new Date();
    const startDate = `${d.getFullYear()}:${d.getMonth()}:${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

    const user = await User.create({
        "name": name,
        "password": password,
        "email": email,
        "birthday": date,
        "gender": gender,
        "image": image,
        "startDate": startDate,
    })

    if(user){
        res.json(
            {
                type: "success"
            }
        )
    }else{
        res.json(
            {
                type: "error"
            }
        )
    }
})


app.get('/blog', async function (req, res) {

    const blogs = await Blog.findAll({
        order: [
            ['id_post', 'DESC'],
        ]
    });

    if(blogs.length > 0) {
        const blogList = []

        for(let i = 0; i < blogs.length; i++) {
            const inforUserPost = await User.findAll({
                where: { "id": blogs[i].dataValues.id_user_post}
            });

            const blogUserPost = {
                nameUserPost : inforUserPost[0].dataValues.name,
                imageUserPost: inforUserPost[0].dataValues.image,
                ...blogs[i].dataValues,
                time_post: moment(blogs[i].dataValues.time_post).toNow(true)
            }

            blogList.push(blogUserPost);
        }

        res.json({type: "success", data: blogList});

        
    }else{
        res.json({type: "No"});
    }
})

app.get('/user&iduser=:id' , async function(req, res) {
    var idUser = req.params.id
    if(Number(idUser)){
        
        const user = await User.findAll({
            where: {
              id: idUser
            }
        });

        if(user.length > 0){
            res.json({type : "success", data: user[0].dataValues})
        }else{
            res.json({type : "Null", data: "người dùng không tồn tại"})
        }
    }else{
        res.json("không hợp lệ")
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        if(file){
            cb(null, Date.now() + '-' +file.originalname )
        }
    }
})

const upload = multer({ storage: storage }).array('file')

app.post("/add-post", async function(req, res) {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        // console.log(req.files)
        // console.log(req.body)
        
        const {idUserPost, statusPost, contentPost, imagePost} = req.body
        const timePost = TimeNow()
        const nameImage = []
        for(let i = 0; i < req.files.length; i++) {
            nameImage.push(req.files[i].filename)
        }
        
        if(idUserPost !== '' && statusPost !== '' && timePost !== ''){
            if(contentPost || imagePost){
                const addBlogSql = await Blog.create({
                    "id_user_post": idUserPost,
                    "status_post": statusPost,
                    "content_post": contentPost,
                    "image_post": nameImage.toString(),
                    "time_post": timePost,
                })

                if(addBlogSql){
                    console.log("ok")
                    res.json({type: 'success'})
                }
            }
        }

    })
})

   


    // const m = moment().format()
    // const m = moment(imagePost).toNow(true)


function TimeNow(){
    const date = new Date()

    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    const seconds = `0${date.getSeconds()}`.slice(-2);

    const timePosst = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + hours + ":" + minutes + ":" + seconds

    return timePosst
}


 
app.listen(process.env.PORT = 3001, () => {
    console.log('JSON Server is running');
})
