const db = require('../../database');
require('dotenv').config();
const md5 = require('md5');

exports.updateUserPassword = (req,res) =>{
        const user = req.result; // this data get from Json web token
        const {currentPassword, newPassword} = req.body; // get data from client

        // user new password convert md5 and assign it to newHashedPassword
        const currentHashedPassword = md5(currentPassword);
        const newHashedPassword = md5(newPassword);

        // check cilent input current password correct or not
        db.query('SELECT Password FROM users WHERE UserName = ?' , [user.UserName], (error, results)=>{
            if(error){
                return res.status(500).json({
                    message:'Server error, please try again later'
                });
            }

            // check password exsi or not
            if(results.length === 0 ){
                return res.status(401).json({
                    message:'password not found'
                });
            }

            // get data from users table 
            const storedUser = results[0];

            // Compare the provided current password with the hashed password in the database
            if (currentHashedPassword !== storedUser.Password) {
                return res.status(401).json({
                    message: 'Invalid password'
                });
            }


            // user.UserName get from Json web token
        db.query('UPDATE users SET Password = ? WHERE UserName = ?', [newHashedPassword, user.UserName],(error, result) =>{
            if (error)
            { return res.status(500).json({ message: 'Server error, please try again later' })};
    

            // checking whether any user record was updated
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'password not update' });
            }

            res.status(200).json({
                message: 'User password updated successfully'
            });
           
        }); // end UPDATE query

        }); // end SELECT query
          
};