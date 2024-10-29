const { request } = require('express');
const db = require('../../database');

// this module show only => Accounts (payable for the customer)


//module for get one Customer details
exports.oneCustomerDetails = (req,res) =>{
    
    const { RegId } = req.params; // get the customer RegId from URL

    if (!RegId) {
        return res.status(400).json({ message: 'RegId is required' }); // Handle missing RegId
    }
    
    // get all details from placc table
    db.query('SELECT * FROM placc WHERE OpnBal != Bal AND cussup_RegId = ? ORDER BY OpnDat ASC', [RegId],(error, result) =>{
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Server error, please try again later'  });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Customer details not found' }); 
        }

        // Return all customer details (send entire result array to the client)
        res.status(200).json(result);
   
    });
};