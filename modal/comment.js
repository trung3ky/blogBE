const { Sequelize, DataTypes } = require('sequelize');
const db = require('../controller/db')


const Comment = db.define('comment', {
    "id_comment": {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    "id_of_post":  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    "id_user_comment":  {
        type: DataTypes.STRING,
        allowNull: false
    },
    "content_comment":  {
        type: DataTypes.STRING,
        allowNull: false
    },
    "time_comment":  {
        type: DataTypes.DATE,
        allowNull: false
    }
})

db.sync()
module.exports = Comment