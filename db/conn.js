const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    database: 'inventory_system',
    password:'',
    user:'root'
})

db.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Connected!")
    }
})

module.exports = db;
