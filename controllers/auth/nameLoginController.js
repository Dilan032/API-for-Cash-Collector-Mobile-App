const db = require('../../database');
const md5 = require('md5');

const { generateToken } = require('../../functions/auth/generateToken'); // Import the function
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

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

            // use generateToken function in -> function/auth/generateToken.js
            const token = generateToken(UserName);

            // use formattedDateTime function in -> function/dateAndTime.js
            const formattedDateTime = getDateAndTime();

            // update user last login time and date
            db.query('UPDATE users SET LastLogin = ? WHERE UserName = ?', [formattedDateTime, UserName],(error) =>{
                if (error)
                { return res.status(500).json({ message: 'Server error, please try again later' })};
            });// end query
        

            // If password matches, login is successful
            return res.status(200).json({
                success: true,
                message: 'User login successful',
                token:token
            });
        });

}