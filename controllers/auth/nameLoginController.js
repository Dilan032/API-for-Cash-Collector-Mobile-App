const db = require('../../database');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const md5 = require('md5');

exports.userNameLogin = (req,res) =>{
    // get user name and password from front-end
    const {UserName, Password} = req.body;

    // user password convert md5 and assign it to hashedPassword
    const hashedPassword = md5(Password);

    // Query the database to find the user by UserName
    db.query('SELECT * FROM users WHERE UserName = ?', [UserName], (error, results) =>{
        if(error){
            return res.status(500).json({
                message:'Server error, please try again later'
            });
        }
        if(results.length === 0 ){
            return res.status(401).json({
                message:'The Provide User name dose not exsit'
            });
        }

        // get data from users table releven user (sql quary)
        const user = results[0];

        // Compare the provided password with the hashed password in the database
        // Compare the provided hashed password with the hashed password in the database
        if (hashedPassword !== user.Password) {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }

            const token = jwt.sign(
                {UserName: UserName}, // Payload with the UserName
                process.env.TOKEN_KEY, // Secret key from .env
                {expiresIn: process.env.TOKEN_EXPIRATION_TIME} // Use expires time from (.env)
            );

            // Get the current date and time in UTC
            const currentDateTime = new Date();

            // Adjust for Sri Lanka Standard Time (UTC +5:30)
            const sriLankaOffset = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
            const sriLankaTime = new Date(currentDateTime.getTime() + sriLankaOffset);

            // Format the date to 'YYYY-MM-DD HH:MM:SS'
            const formattedDateTime = sriLankaTime.toISOString().slice(0, 19).replace('T', ' ');

            // update user last login time and date
            db.query('UPDATE users SET LastLogin = ? WHERE UserName = ?', [formattedDateTime, UserName],(error, result) =>{
                if (error)
                { return res.status(500).json({ message: 'Server error, please try again later' })};
            });
        

            // If password matches, login is successful
            return res.status(200).json({
                success: true,
                message: 'User login successful',
                token:token
            });
        });

}