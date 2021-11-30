const { Sequelize, DataTypes } = require('sequelize');
const db = require('../controller/db')


const Notification = db.define('notification', {
    "id": {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    "id_post":  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    "id_user":  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    "id_user_action":  {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    "type":  {
        type: DataTypes.STRING,
        allowNull: false
    },
    "time":  {
        type: DataTypes.DATE,
        allowNull: false
    }
})

db.sync()
module.exports = Notification