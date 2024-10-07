const db = require('../../database');
const jwt = require('jsonwebtoken');

exports.pinLogin = (req, res) =>{
    // get user pin in front-end
    const {UserPin} = req.body;

    db.query('SELECT * FROM users WHERE UserPin = ?', [UserPin], (error, results) =>{
        if(error){
            console.log('error');
            return res.status(500).json({
                message:'Server error, please try again later'
            });
        }
        if(results.length === 0 ){
            return res.status(401).json({
                message:'The Provide User Pin dose not exsit'
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