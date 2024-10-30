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

        // Convert OpnDat and DueDat to Sri Lanka Standard Time (UTC +5:30)
        const convertedResult = result.map(row => {
            // Create Date objects
            const created_dateSLST = new Date(new Date(row.created_date).getTime() + (5 * 60 + 30) * 60000);

            // Return a new row object with converted dates
            return {
                ...row,
                created_date: created_dateSLST
            };
        });

        // Return all customer details with SLST dates
        res.status(200).json(convertedResult);
        
    });
};