const db = require('../../database');

// Module for getting all Customer details
exports.showTodayCollection = (req, res) => {

    const { EmpCode } = req.params; // get the login user EmpCode from URL

    if (!EmpCode) {
        return res.status(400).json({ message: 'EmpCode is required' }); // Handle missing EmpCode
    }

    // Get current date
    const currentDate = new Date();
    const Today = currentDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'

    // First query to get today transaction
    db.query('SELECT * FROM placc WHERE LastTraDat = ? AND EmpCode = ?', [Today, EmpCode], (error, placcResult) => {
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

            // Combine data from both tables
            const combinedResult = {
                cussup: cussupResult,
                placc: placcResult
            };

             // Initialize dailyTotal object to accumulate totals
             const dailyTotal = {};

             // Iterate over each customer in cussupResult
             cussupResult.forEach(cussupRow => {
                 const cusName = cussupRow.Name;
                 const RegId = cussupRow.RegId;
 
                 // Initialize the customer's total if not already done
                 if (!dailyTotal[cusName]) {
                     dailyTotal[cusName] = 0;
                 }
 
                 // Find matching records in placcResult and accumulate DailyTotal
                 placcResult.forEach(placcRow => {
                     if (RegId === placcRow.cussup_RegId) {
                         dailyTotal[cusName] += placcRow.DailyTotal;
                     }
                 });
             });

             // Calculate total for all customers by summing up individual daily totals
            const overallTotal = Object.values(dailyTotal).reduce((acc, value) => acc + value, 0);
 
             // Create an array of results with customer names and their daily totals
             const results = Object.keys(dailyTotal).map(cusName => ({
                 CusName: cusName,
                 dailyTotal: dailyTotal[cusName]
             }));
 

             // Return the combined result
             return res.status(200).json({ individualTotals: results, overallTotal });
            
        });
    });
};
