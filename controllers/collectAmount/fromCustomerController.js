const db = require('../../database');

// Collect amount module
exports.collectAmount = (req, res) => {
    const customerDetails = req.body; // Get data from the login user
    const accountNumber = customerDetails.AccNo;
    const Bal = customerDetails.Bal;

    if (!accountNumber) {
        return res.status(400).json({ message: 'AccNo is required' }); // Handle missing AccNo
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
        return res.status(400).json({ message: 'No fields provided for update' });
    }

    // Add the account number at the end of the values array for the WHERE clause
    values.push(accountNumber);

    // Construct the final SQL query
    const updateQuery = `UPDATE pltra SET ${fields.join(', ')} WHERE placc_AccNo = ?`;

    // Run the update query
    db.query(updateQuery, values, (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Server error, please try again later' });
        }

        // Check if any rows were affected (i.e., updated)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Account not found or no changes made' });
        }


        // update placc table

        // get current date
        const currentDate = new Date();
        const LastTraDat = currentDate.toISOString().split('T')[0]; // Extracts 'YYYY-MM-DD'

        db.query('UPDATE placc SET Bal = ?, LastTraDat = ? WHERE AccNo = ?', [Bal, LastTraDat, accountNumber], (error) => {
            if (error) {
                return res.status(500).json({ message: 'Server error, please try again later' });
            }
        }); // end query



        // Success response for update
        res.status(200).json({
            message: 'Account updated successfully'
        });
    });
};
