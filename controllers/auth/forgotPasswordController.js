// this file contain 'getOTP' module , 'send-otp' module and 'reset-password' module

const db = require('../../database');
const nodemailer = require('nodemailer');
require('dotenv').config(); // get envirment variables in (.env file)


// gmail configuration details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});


// GetOTP module
const getOTP = (req, res)=> {
    // get email from user
    const { email } = req.body; 

     // Check if user exists
     db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) 
            return res.status(500).json({ error: 'Database error' });

        if (result.length === 0) 
            return res.status(404).json({ error: 'User not found' });

        // Generate a 4-digit OTP
        const token = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
        const expiry = new Date(Date.now() + process.env.OTP_EXPIRATION_TIME * 60000); // OTP_EXPIRATION_TIME in (.env file) * (60000 milliseconds in 1 minute) 

        // Store token in the database
        db.query('UPDATE users SET password_reset_otp = ?, password_otp_expiry = ? WHERE email = ?', [token, expiry, email], (err) => {
            if (err) 
                return res.status(500).json({ error: 'Database error' });

            // Send email with the OTP
            const mailOptions = {
                from: process.env.MAIN_EMAIL, // get .env file main email
                to: email,
                subject: 'Password Reset Request',
                text: `Your password reset OTP is: ${token}. This token is valid for 1 hour.`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) 
                    return res.status(500).json({ error: 'Error sending email' });

                res.json({ message: 'Password reset email sent' });
            });
        });
    });

}// end module



// send OTP module
const sendOTP = (req, res)=> {

} // end module


// reset password module
const resetPassword = (req, res)=> {

}// end module




// export moduless
module.exports = {
    getOTP,
    sendOTP,
    resetPassword
};