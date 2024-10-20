const db = require('../../database');

//module for get all Customer details
exports.allCustomerDetails = (req,res) =>{
    const user = req.result; // this data get from Json web token

    // Check if 'user' and 'user.UserName' are defined before querying the database
    if (!user || !user.UserName) {
        return res.status(400).json({ message: 'Invalid token or missing UserName' });
    }

    // Check if the user exists in the database
    db.query('SELECT * FROM users WHERE UserName = ?', [user.UserName],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' }); 
        }        
    });// end query 
    
    // get all details from cussup table in CS
    db.query('SELECT * FROM cussup WHERE cussupcat_id = ?', ['CS'],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Customer details not found' }); 
        }

        // Return all customer details (send entire result array to the client)
        res.status(200).json(result);
        
    });
};