const db = require('../../database');
const { getDateAndTime } = require('../../functions/dateAndTime'); // Import the function

// Collect amount module for multiple accounts
exports.bankTransfer = (req, res) => {
    const customerDetails = req.body; // Expecting an array of objects
    console.log(customerDetails);

    if (!Array.isArray(customerDetails) || customerDetails.length === 0) {
        return res.status(400).json({ message: 'Invalid input, expected a non-empty array' });
    }

    let updateCount = 0;

    customerDetails.forEach((details, index) => {
        const { AccNo: accountNumber, Bal, EmpCode, DailyTotal, RecImg } = details;

        // Recipt type
        const RecType = "bankRec";

        const currentDate = new Date();
        const LastTraDat = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const today = currentDate.toISOString().split('T')[0]; // Current date in 'YYYY-MM-DD'

        // First query: Check and Collect Daily Total
        db.query('SELECT LastTraDat, DailyTotal FROM placc WHERE AccNo = ?', [accountNumber], (error, result) => {
            if (error) {
                console.error(`Error fetching account details for AccNo ${accountNumber}:`, error);
                if (index === customerDetails.length - 1) {
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }
                return;
            }

            if (result.length === 0) {
                console.error(`No account found for AccNo ${accountNumber}`);
                if (index === customerDetails.length - 1) {
                    return res.status(404).json({ message: `Account not found for AccNo ${accountNumber}` });
                }
                return;
            }

            // Process LastTraDat and DailyTotal
            const lastTransactionDateUTC = result[0].LastTraDat;
            const lastTransactionDateWithDate = getDateAndTime(lastTransactionDateUTC);
            const lastTransactionDate = new Date(lastTransactionDateWithDate).toISOString().split('T')[0]; // Extract only the date

            // Get the previous DailyTotal for today
            const previousDailyTotal = (lastTransactionDate === today) ? parseFloat(result[0].DailyTotal) : 0;

            // const previousDailyTotal = parseFloat(result[0].DailyTotal); // Current value in database
            // let updatedDailyTotal = parseFloat(DailyTotal); // Input value

            let updatedDailyTotal;
            if (lastTransactionDate === today) {
                updatedDailyTotal = previousDailyTotal + parseFloat(DailyTotal); // add only if dates match
            } else {
                updatedDailyTotal = parseFloat(DailyTotal); // else just use the new daily total
            }

            console.log(`Account ${accountNumber}:`);
            console.log("Last Transaction Date:", lastTransactionDate);
            console.log("Previous Daily Total:", previousDailyTotal);
            console.log("Updated Daily Total:", updatedDailyTotal);

            // Second update query
            db.query(
                'UPDATE pltra SET Bal = ?, EmpID = ? WHERE placc_AccNo = ?',
                [Bal, EmpCode, accountNumber],
                (error, result) => {
                    if (error) {
                        console.log(`Error updating pltra for account ${accountNumber}:`, error);
                        if (index === customerDetails.length - 1) {
                            return res.status(500).json({ message: 'Server error, please try again later' });
                        }
                        return;
                    }

                    if (result.affectedRows === 0) {
                        console.log(`No rows affected in pltra for account ${accountNumber}`);
                        if (index === customerDetails.length - 1) {
                            return res.status(404).json({ message: 'Account not found or no changes made in pltra' });
                        }
                        return;
                    }

                    // Third query: Insert into pltraimg
                    db.query(
                        'INSERT INTO pltraimg (RecType, RecImg, placc_AccNo) VALUES (?, ?, ?)',
                        [RecType, RecImg, accountNumber],
                        (error, result) => {
                            if (error) {
                                console.error(`Error inserting into pltraimg for account ${accountNumber}:`, error);
                                if (index === customerDetails.length - 1) {
                                    return res.status(500).json({ message: 'Server error, please try again later' });
                                }
                                return;
                            }

                            // Fourth update query
                            db.query(
                                'UPDATE placc SET Bal = ?, LastTraDat = ?, DailyTotal = ?, EmpCode = ? WHERE AccNo = ?',
                                [Bal, LastTraDat, updatedDailyTotal, EmpCode, accountNumber],
                                (error, result) => {
                                    if (error) {
                                        console.log(`Error updating placc for account ${accountNumber}:`, error);
                                        if (index === customerDetails.length - 1) {
                                            return res.status(500).json({ message: 'Server error, please try again later' });
                                        }
                                        return;
                                    }

                                    if (result.affectedRows === 0) {
                                        console.log(`No rows affected in placc for account ${accountNumber}`);
                                        if (index === customerDetails.length - 1) {
                                            return res.status(404).json({ message: 'Account not found or no changes made in placc' });
                                        }
                                        return;
                                    }

                                    updateCount++;
                                    if (updateCount === customerDetails.length) {
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
