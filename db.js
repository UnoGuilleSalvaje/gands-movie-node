// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Cambia por tu usuario de MySQL
    password: '', // Cambia por tu contraseña
    database: 'gandsmovie'
});

module.exports = pool.promise();
