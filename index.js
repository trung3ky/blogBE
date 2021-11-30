const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connection = require('./controller/db')
const cors = require('cors')
const moment = require('moment'); 
const multer = require('multer')
const http = require('http')

const User = require('./modal/user')
const Blog = require('./modal/blog')
const Like = require('./modal/like')
const Notification = require('./modal/notification')
const { resolveSoa } = require('dns')

const server = http.createServer(app)
// const io = require('socket.io')(server)

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


app.post('/get-like', async (req, res) => {
    const idBlog = req.body.idBlog
    const like = await Like.findAll({
        where: {
          id_post: Number(idBlog),
        }
    });

    const likeList = []
    for(let i = 0; i < like.length; i++) {
        const inforUserLike = await User.findAll({
            where: { "id": like[i].dataValues.id_user}
        });

        likeList.push({
            name: inforUserLike[0].dataValues.name,
            id: inforUserLike[0].dataValues.id
        })
    }
    if(like.length > 0){
        res.json(
            {
                type: "success",
                data: likeList,
            }
        )
    }else {
        res.json(
            {
                type: "success",
                data: [],
            }
        )
    }
})

app.post('/add-like', async (req, res) => {
    const idUser = req.body.idUser
    const idBlog = req.body.idBlog

    const checkLike = await Like.findAll({
        where: {id_post: idBlog, id_user: idUser}
    })

    if(checkLike.length > 0) {
        await Like.destroy({
            where: {
              id: checkLike[0].dataValues.id
            }
        });

        res.json({
            type: "success",
            status: false,
        })
    }
    if(checkLike.length === 0) {
        const like = await Like.create({
            id_post: idBlog,
            id_user: idUser,
            type: "tym",
            time: TimeNow()
        })
        res.json({
            type: "success",
            status: true,
        })
    }

})

// get notification
app.post('/get-notification', async (req, res) => {
    const idUser = req.body.idUser

    const notification = await Notification.findAll({
        where: {
            "id_user": idUser
        },
        order: [
            ['id', 'DESC'],
        ]
    })
    
    if(notification.length > 0) {
        const dataList = []
        const notificationList = []
        notification.map(item => {
            notificationList.push(item.dataValues)
        })

        for(let i = 0; i < notificationList.length; i++) {
            const inforUser = await User.findAll({
                where: { "id": notificationList[i].id_user_action}
            });

            const blog = await Blog.findAll({
                where: { "id_post": notificationList[i].id_post}
            })

            dataList.push({
                img: inforUser[0].dataValues.image,
                name: inforUser[0].dataValues.name,
                content: blog[0].dataValues.content_post,
                type: notificationList[i].type,
                time: moment(notificationList[i].time).toNow(true)
            })
        }
        res.json({
            type: 'success',
            data: dataList
        })
    }else {
        res.json({type: 'NoData', data: []})
    }

})

app.post('/get-item-notification', async (req, res) => {
    const id_user_action = req.body.idUserAction
    const id_post = req.body.idPost

    console.log(id_user_action)
    console.log(id_post)
    const notification = await Notification.findOne({
        where: {
            id_post: id_post,
            id_user_action: id_user_action
        },order: [
            ['id', 'DESC'],
        ]
    })
    console.log(notification)

    if(notification){
        const inforUser = await User.findAll({
            where: { "id": notification.dataValues.id_user_action}
        });

        const blog = await Blog.findAll({
            where: { "id_post": notification.dataValues.id_post}
        })
        res.json({
            type: 'success', 
            data: {
                img: inforUser[0].dataValues.image,
                name: inforUser[0].dataValues.name,
                content: blog[0].dataValues.content_post,
                type: notification.dataValues.type,
                time: moment(notification.dataValues.time).toNow(true)
            }
        })
    }
})


app.post('/add-notification', async (req, res) => {
    const id_post = req.body.idPost
    const id_user = req.body.idUser
    const id_user_action = req.body.idUserAction
    const type = req.body.type
    
    const checkNotification = await Notification.findAll({
        where: {
            id_post: id_post, 
            id_user: id_user,
            id_user_action: id_user_action,
            type: type,
        }
    })

    
    if(checkNotification.length > 0) {
        await Notification.destroy({
            where: {
              id: checkNotification[0].dataValues.id
            }
        });

        res.json({
            type: "success",
            status: false,
        })
    }
    if(checkNotification.length === 0) {
        const notification = await Notification.create({
            id_post: id_post,
            id_user: id_user,
            id_user_action: id_user_action,
            type: type,
            time: TimeNow()
        })
        res.json({
            type: "success",
            status: true,
        })
    }
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

// io.on('connection', (socket) => {
//     // socket.on('welcome', 'xin chào')
//     console.log("kết nối nối nối nối")
//     console.log("kết nối nối nối nối")
//     console.log("kết nối nối nối nối")

//     socket.on('disconnect', () => {
//         console.log('disconnect')
//     })
// })


 
server.listen(process.env.PORT || 3001, () => {
    console.log('JSON Server is running');
})
