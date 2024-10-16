const mysql = require("mysql");
require('dotenv').config(); // get envirment variables in (.env file)

// Function to create and maintain MySQL connection
function handleDisconnect() {
    const db = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    });

    // Connect to the MySQL server
    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds if error occurs
        } else {
            console.log('Connected to MySQL database');
        }
    });

    // Handle connection errors and automatic reconnection
    db.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('MySQL database connection lost. Reconnecting...');
            handleDisconnect(); // Reconnect on connection lost
        } else {
            throw err; 
        }
    });

    return db;
}

// Establish initial connection
const db = handleDisconnect();

//export the db (connection)
module.exports = db;