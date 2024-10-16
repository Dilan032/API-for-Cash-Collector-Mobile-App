const db = require('../../database');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

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

        // get token key from (.env) file 
        const token = jwt.sign(
            {UserName: UserName}, 
            process.env.TOKEN_KEY, 
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
        

        if(results.length > 0){
            return res.status(200).json({ 
                success: true,
                message: 'User login successful',
                token:token
            });

        }
        

    });
}