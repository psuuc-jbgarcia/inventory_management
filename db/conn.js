require('dotenv').config();
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password:process.env.DB_PASSWORD,
    user:process.env.DB_USER
})

db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Connected!")
    }
})

module.exports = db;
