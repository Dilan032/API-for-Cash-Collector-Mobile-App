const mysql = require("mysql");
require('dotenv').config(); // get envirment variables in (.env file)

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//check database connected or not
db.connect((error)=>{
    if(error){
        console.log('Error connecting to MySQL:', error);
    }else{
        console.log("mysql db connected");
    }
});

//export the db
module.exports = db;