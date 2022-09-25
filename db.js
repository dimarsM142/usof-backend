const mysql = require("mysql2");
const fs = require('fs');
const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const connection = mysql.createPool({
    host: parsed.host,
    user: parsed.user,
    database: parsed.database,
    password: parsed.password,
    
});

module.exports = connection;