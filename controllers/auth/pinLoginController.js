const db = require('../../database');

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

        if(results.length > 0){
            return res.status(200).json({ 
                success: true,
                message: 'User login successful'
            });

        }
        

    });
}