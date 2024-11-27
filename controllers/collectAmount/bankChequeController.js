const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

// Collect amount module for multiple accounts
exports.bankCheque = (req, res) => {
    const customerDetails = req.body; // Expecting an array of objects
    console.log("Received customer details:", customerDetails);

    if (!Array.isArray(customerDetails) || customerDetails.length === 0) {
        return res.status(400).json({ message: 'Invalid input, expected a non-empty array' });
    }

    let updateCount = 0; // Counter for tracking successful updates

    customerDetails.forEach((details, index) => {
        const { AccNo: accountNumber, Bal, EmpCode, DailyTotal, BankName, CheqNo, CheqDat, RecImg } = details;

        const RecType = "chequeRec"; // Receipt type
        const currentDate = new Date();
        const today = currentDate.toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD'

        // First query: Check and Collect Daily Total
        db.query('SELECT LastTraDat, DailyTotal FROM placc WHERE AccNo = ?', [accountNumber], (error, result) => {
            if (error) {
                console.error(`Error fetching account details for AccNo ${accountNumber}:`, error);
                return res.status(500).json({ message: 'Server error, please try again later' });
            }

            if (result.length === 0) {
                console.error(`No account found for AccNo ${accountNumber}`);
                return res.status(404).json({ message: `Account not found for AccNo ${accountNumber}` });
            }

            // Process LastTraDat and DailyTotal
            const lastTransactionDateUTC = result[0].LastTraDat;
            const lastTransactionDateWithDate = getDateAndTime(lastTransactionDateUTC);
            const lastTransactionDate = new Date(lastTransactionDateWithDate).toISOString().split('T')[0]; // Extract only the date

            const previousDailyTotal = parseFloat(result[0].DailyTotal); // Current value in database
            let updatedDailyTotal = parseFloat(DailyTotal); // Input value

            if (lastTransactionDate === today) {
                updatedDailyTotal += previousDailyTotal;
            }

            console.log(`Account ${accountNumber}:`);
            console.log("Last Transaction Date:", lastTransactionDate);
            console.log("Previous Daily Total:", previousDailyTotal);
            console.log("Updated Daily Total:", updatedDailyTotal);

            // Second query: Update pltra
            db.query(
                'UPDATE pltra SET Bal = ?, EmpID = ?, BankName = ?, CheqNo = ?, CheqDat = ? WHERE placc_AccNo = ?',
                [Bal, EmpCode, BankName, CheqNo, CheqDat, accountNumber],
                (error, result) => {
                    if (error) {
                        console.error(`Error updating pltra for account ${accountNumber}:`, error);
                        return res.status(500).json({ message: 'Server error, please try again later' });
                    }

                    if (result.affectedRows === 0) {
                        console.error(`No rows affected in pltra for account ${accountNumber}`);
                        return res.status(404).json({ message: `No changes made for account ${accountNumber}` });
                    }

                    // Third query: Insert into pltraimg
                    db.query(
                        'INSERT INTO pltraimg (RecType, RecImg, placc_AccNo) VALUES (?, ?, ?)',
                        [RecType, RecImg, accountNumber],
                        (error) => {
                            if (error) {
                                console.error(`Error inserting into pltraimg for account ${accountNumber}:`, error);
                                return res.status(500).json({ message: 'Server error, please try again later' });
                            }

                            // Fourth query: Update placc
                            db.query(
                                'UPDATE placc SET Bal = ?, LastTraDat = ?, DailyTotal = ?, EmpCode = ? WHERE AccNo = ?',
                                [Bal, today, updatedDailyTotal, EmpCode, accountNumber],
                                (error, result) => {
                                    if (error) {
                                        console.error(`Error updating placc for account ${accountNumber}:`, error);
                                        return res.status(500).json({ message: 'Server error, please try again later' });
                                    }

                                    if (result.affectedRows === 0) {
                                        console.error(`No rows affected in placc for account ${accountNumber}`);
                                        return res.status(404).json({ message: `No changes made for account ${accountNumber}` });
                                    }

                                    updateCount++;
                                    if (updateCount === customerDetails.length) {
                                        // If all updates are successful, send a success response
                                        res.status(200).json({ message: 'All accounts updated successfully' });
                                    }
                                }
                            );
                        }
                    );
                }
            );
        });
    });
};
