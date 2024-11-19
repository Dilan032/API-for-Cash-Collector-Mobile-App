const db = require('../../database');

// Collect amount module for multiple accounts
exports.bankCheque = (req, res) => {
    const customerDetails = req.body; // Expecting an array of objects
    console.log(customerDetails);

    if (!Array.isArray(customerDetails) || customerDetails.length === 0) {
        return res.status(400).json({ message: 'Invalid input, expected a non-empty array' });
    }

    let updateCount = 0;

    customerDetails.forEach((details, index) => {
        const { AccNo: accountNumber, Bal, EmpCode, DailyTotal, BankName, CheqNo, CheqDat } = details;

        const currentDate = new Date();
        const LastTraDat = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        // First update query
        db.query(
            'UPDATE pltra SET Bal = ?, EmpID = ?, BankName = ?, CheqNo = ?, CheqDat = ?  WHERE placc_AccNo = ?',
            [Bal, EmpCode, BankName, CheqNo, CheqDat, accountNumber],
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
                    [Bal, LastTraDat, DailyTotal, EmpCode, accountNumber],
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
    });
};