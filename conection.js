const mysql = require('mysql');
require('dotenv').config();

var conection = mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
});

conection.connect((err)=> {
    if (!err) {
        console.log('Conectado');
    }else {
        console.log(err);
    }
});

module.exports = conection;