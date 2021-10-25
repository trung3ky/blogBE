
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('myblog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


sequelize.authenticate()
            .then(() => {
                console.log("thành công")
            })

module.exports = sequelize;
