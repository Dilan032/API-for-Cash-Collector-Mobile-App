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
            console.log('Server error');
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


        if(results.length > 0){
            return res.status(200).json({ 
                success: true,
                message: 'User login successful',
                token:token
            });

        }
        

    });
}