const db = require('../../database');

// Collect amount module for multiple accounts
exports.collectAmount = (req, res) => {
    const customerDetailsArray = req.body; // Assume this is an array of customer details
    

    if (!Array.isArray(customerDetailsArray) || customerDetailsArray.length === 0) {
        return res.status(400).json({ message: 'Customer details must be provided as an array' });
    }

    // Process each customer in the array
    let errorOccurred = false;

    customerDetailsArray.forEach((customerDetails, index) => {
        const accountNumber = customerDetails.AccNo;
        const Bal = customerDetails.Bal;

        if (!accountNumber) {
            errorOccurred = true;
            return res.status(400).json({ message: `AccNo is required for customer at index ${index}` }); // Handle missing AccNo
        }

        // Build dynamic SQL update query
        let fields = [];
        let values = [];

        // Loop through customerDetails and prepare dynamic query
        for (const key in customerDetails) {
            if (customerDetails.hasOwnProperty(key) && key !== 'AccNo') { // Exclude 'AccNo' from update fields
                fields.push(`${key} = ?`); // Create key = ? placeholders
                values.push(customerDetails[key]); // Push the value corresponding to the field
            }
        }

        // If no fields are provided for update
        if (fields.length === 0) {
            errorOccurred = true;
            return res.status(400).json({ message: `No fields provided for update for customer at index ${index}` });
        }

        // Add the account number at the end of the values array for the WHERE clause
        values.push(accountNumber);

        // Construct the final SQL query
        const updateQuery = `UPDATE pltra SET ${fields.join(', ')} WHERE placc_AccNo = ?`;

        // Run the update query
        db.query(updateQuery, values, (error, result) => {
            if (error) {
                errorOccurred = true;
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            // Check if any rows were affected (i.e., updated)
            if (result.affectedRows === 0) {
                errorOccurred = true;
                return res.status(404).json({ message: `Account not found or no changes made for AccNo: ${accountNumber}` });
            }

            // Get current date
            const currentDate = new Date();
            const LastTraDat = currentDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'

            // Update the `placc` table
            db.query('UPDATE placc SET Bal = ?, LastTraDat = ? WHERE AccNo = ?', [Bal, LastTraDat, accountNumber], (error) => {
                if (error) {
                    errorOccurred = true;
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }
            }); // End query for placc table
        });
    });

    // If no error occurred during the update process
    if (!errorOccurred) {
        res.status(200).json({
            message: 'All accounts updated successfully'
        });
    }
};
