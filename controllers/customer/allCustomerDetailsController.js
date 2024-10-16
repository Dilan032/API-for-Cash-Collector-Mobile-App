const db = require('../../database');

//module for get all Customer details
exports.allCustomerDetails = (req,res) =>{
    const user = req.result; // this data get from Json web token
    
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