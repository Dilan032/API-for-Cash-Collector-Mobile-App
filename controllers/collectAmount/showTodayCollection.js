const db = require('../../database');

// Module for getting all Customer details
exports.showTodayCollection = (req, res) => {

    // Get current date
    const currentDate = new Date();
    const Today = currentDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'

    // First query to get cussup_RegId from placc table
    db.query('SELECT * FROM placc WHERE LastTraDat = ?', [Today], (error, placcResult) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        if (placcResult.length === 0) {
            return res.status(404).json({ message: 'There is no collection of the day' });
        }

        // Collect all cussup_RegId values into an array
        const cussup_RegIds = placcResult.map(row => row.cussup_RegId);

        // Second query to get details from cussup table
        db.query('SELECT * FROM cussup WHERE RegId IN (?)', [cussup_RegIds], (error, cussupResult) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (cussupResult.length === 0) {
                return res.status(404).json({ message: 'No accounts found' });
            }

            // Combine data from both tables (if needed)
            const combinedResult = {
                cussup: cussupResult,
                placc: placcResult
            };

            // if(cussupResult.RegId == placcResult.cussup_RegId){
            //     placcResult
            // }

            // Return the combined result
            return res.status(200).json(combinedResult);
            
        });
    });
};
