const sequelize = require("sequelize");
const connection = new sequelize('guiaperguntas','root','6991Lara03',{

    host:'localhost',
    dialect:'mysql'

});

module.exports = connection;