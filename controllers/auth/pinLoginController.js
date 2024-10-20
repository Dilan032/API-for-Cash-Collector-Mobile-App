const db = require('../../database');
const md5 = require('md5');
const { generateToken } = require('../../functions/auth/generateToken'); // Import the function
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

exports.pinLogin = (req, res) =>{
    // get user pin in front-end
    const {mobile_password} = req.body;

    // user mobile pin convert md5 and assign it
    const hashedPassword = md5(mobile_password);

    db.query('SELECT * FROM users WHERE mobile_password = ?', [hashedPassword], (error, results) =>{
        if(error){
            return res.status(500).json({
                message:'Server error, please try again later'
            });
        }
        if(results.length === 0 ){
            return res.status(401).json({
                message:'The Provide Mobile pin dose not exsit'
            });
        }


        //get user data from database users table
        const user = results[0];
        const UserName = user.UserName; 

        // use generateToken function in -> function/auth/generateToken.js
        const token = generateToken(UserName);

        // use formattedDateTime function in -> function/dateAndTime.js
        const formattedDateTime = getDateAndTime();

        // update user last login time and date
        db.query('UPDATE users SET LastLogin = ? WHERE UserName = ?', [formattedDateTime, UserName],(error) =>{
            if (error)
            { return res.status(500).json({ message: 'Server error, please try again later' })};
        }); // end query
        

        if(results.length > 0){
            return res.status(200).json({ 
                success: true,
                message: 'User login successful',
                token:token
            });

        }
        

    });
}