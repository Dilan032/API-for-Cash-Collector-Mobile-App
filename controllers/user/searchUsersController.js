const db = require('../../database');

//module for get all User details
exports.searchUser = (req,res) =>{
    const userInput = req.body.Name; // get user input from user
    
    
    // Check if userInput is provided, otherwise send an error
    if (!userInput) {
        return res.status(400).json({ message: 'Please provide a name to search' });
    }

    // get all details from cussup table in CS
    db.query('SELECT * FROM cussup WHERE cussupcat_id = ? AND Name LIKE ?', ['CS', `%${userInput}%`],(error, result) =>{
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'User details not found' }); 
        }

        // Return all User details (send entire result array to the client)
        res.status(200).json(result);
        
    });
};