const db = require('../../database');

//module for get all User details
exports.allUserDetails = (req,res) =>{
    
    // get all details from cussup table in CS
    db.query('SELECT * FROM cussup WHERE cussupcat_id = ?', ['CS'],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        } else {
            // Loop through the results and remove the password field and mobile_password field
            result.forEach(row => {
                delete row.Password;  // Remove the password field
                delete row.mobile_password;  // Remove the mobile_password field
            });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User details not found' }); 
        }

        // Return all user details (send entire result array to the client)
        res.status(200).json(result);
        
    });
};