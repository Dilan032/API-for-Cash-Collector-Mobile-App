const db = require('../../database');

//contoll the get user details
exports.userDetails = (req,res) =>{
    const user = req.result; // this data get from Json web token
    
    db.query('SELECT * FROM users WHERE UserName = ?', [user.UserName],(error, result) =>{
        if (error) {
            return res.status(500).json({
                message: 'Server error, please try again later'
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Return user details
        const userData = result[0];
        res.status(200).json({
            id: userData.id,
            username: userData.UserName,
            email: userData.email,
            contactNum: userData.contactNum
        });

    });


};