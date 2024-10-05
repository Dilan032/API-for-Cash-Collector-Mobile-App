const db = require('../../database');
const bcrypt = require('bcrypt');

exports.userNameLogin = (req,res) =>{
    // get user name and password from front-end
    const {UserName, Password} = req.body;

    // Query the database to find the user by UserName
    db.query('SELECT * FROM users WHERE UserName = ?', [UserName], (error, results) =>{
        if(error){
            console.log('error');
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
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).json({
                    message: 'Server error, please try again later'
                });
            }

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Invalid password'
                });
            }

            // If password matches, login is successful
            return res.status(200).json({
                success: true,
                message: 'User login successful'
            });
        });

    });
}