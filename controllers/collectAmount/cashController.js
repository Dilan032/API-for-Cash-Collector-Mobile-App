const db = require('../../database');
const moment = require('moment-timezone');

// Collect amount module for multiple accounts
exports.cashCollect = (req, res) => {
    const customerDetails = req.body; // Expecting an array of objects
    console.log(customerDetails);

    if (!Array.isArray(customerDetails) || customerDetails.length === 0) {
        return res.status(400).json({ message: 'Invalid input, expected a non-empty array' });
    }

    let updateCount = 0;

    customerDetails.forEach((details, index) => {
        const { AccNo: accountNumber, Bal, EmpCode, DailyTotal } = details;

        const currentDate = new Date();
        const today = currentDate.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

        // Check and Collect Daily Total
        db.query(
            'SELECT LastTraDat, DailyTotal FROM placc WHERE AccNo = ?',
            [accountNumber],
            (error, result) => {
                if (error) {
                    return res.status(500).json({ message: 'Server error, please try again later' });
                }

                if (result.length === 0) {
                    return res.status(404).json({ message: 'Account not found or no LastTraDat and DailyTotal available' });
                }

                const lastTransactionDateUTC = result[0].LastTraDat;

                // date convert sri lankan standed time
                const lastTransactionDate = moment.tz(lastTransactionDateUTC, 'Asia/Colombo').format('YYYY-MM-DD');

                // Calculate previousDailyTotal based on today's date
                const previousDailyTotal =  parseFloat(result[0].DailyTotal);

                let updatedDailyTotal;
                if (lastTransactionDate === today) {
                    updatedDailyTotal = previousDailyTotal + parseFloat(DailyTotal); // add only if dates match
                } else {
                    updatedDailyTotal = parseFloat(DailyTotal); // else just use the new daily total
                }

                console.log("last Transaction Date", lastTransactionDate);
                console.log("today", today);
                console.log("previous Daily Total", previousDailyTotal);
                console.log("updated Daily Total = ", updatedDailyTotal);
                console.log();
                

                // First update query
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

                        // Second update query
                        db.query(
                            'UPDATE placc SET Bal = ?, LastTraDat = ?, DailyTotal = ?, EmpCode = ? WHERE AccNo = ?',
                            [Bal, today, updatedDailyTotal, EmpCode, accountNumber],
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
};
