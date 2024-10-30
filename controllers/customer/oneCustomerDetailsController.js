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

        // Convert OpnDat and DueDat to Sri Lanka Standard Time (UTC +5:30)
        const convertedResult = result.map(row => {
            // Create Date objects
            const opnDatSLST = new Date(new Date(row.OpnDat).getTime() + (5 * 60 + 30) * 60000);
            const dueDatSLST = new Date(new Date(row.DueDat).getTime() + (5 * 60 + 30) * 60000);

            // Return a new row object with converted dates
            return {
                ...row,
                OpnDat: opnDatSLST,
                DueDat: dueDatSLST
            };
        });

        // Return all customer details with SLST dates
        res.status(200).json(convertedResult);
   
    });
};