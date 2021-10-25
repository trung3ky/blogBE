const { Sequelize, DataTypes } = require('sequelize');
const db = require('../controller/db')


const User = db.define('user', {
    "id": {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    "name": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "password": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "address": {
        type: DataTypes.STRING,
        allowNull: true
    },
    "email": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "gender": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "description": {
        type: DataTypes.STRING,
        allowNull: true
    },
    "image": {
        type: DataTypes.STRING,
        allowNull: false
    },
    "startDate": {
        type: DataTypes.DATE,
        allowNull: true
    },
    "birthday": {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
})

db.sync()
module.exports = User