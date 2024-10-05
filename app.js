const express = require("express");
const db = require('./database');
const router = express.Router();

const app = express(); // Create an instance of an Express app

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.listen(3000,()=>{
    console.log("Sever Start on Port 3000");
});

//define routes
app.use('/', require('./routes/page'));