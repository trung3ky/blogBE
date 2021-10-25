const { Sequelize, DataTypes } = require('sequelize');
const db = require('../controller/db')


const Blog = db.define('Blog', {
    "id_post": {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    "id_user_post":  {
        type: DataTypes.STRING,
        allowNull: false
    },
    "status_post":  {
        type: DataTypes.STRING,
        allowNull: false
    },
    "content_post":  {
        type: DataTypes.STRING,
        allowNull: true
    },
    "image_post":  {
        type: DataTypes.STRING,
        allowNull: true
    },
    "time_post":  {
        type: DataTypes.DATE,
        allowNull: false
    },
})

db.sync()
module.exports = Blog