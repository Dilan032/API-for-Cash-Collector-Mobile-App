const express = require("express");
const db = require('./database');
const router = express.Router();

const app = express(); // Create an instance of an Express app

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// port number can change in (.env) file and defalt port number 3000
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Sever Start on Port ${port}`);
});

//define routes
app.use('/', require('./routes/page'));