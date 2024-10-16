// this file contain 'getOTP' module , 'send-otp' module and 'reset-password' module

const db = require('../../database');
const nodemailer = require('nodemailer');
require('dotenv').config(); // get envirment variables in (.env file)
const md5 = require('md5');


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
        const OTP = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
        const expiry = new Date(Date.now() + process.env.OTP_EXPIRATION_TIME * 60000); // OTP_EXPIRATION_TIME in (.env file) * (60000 milliseconds in 1 minute) 

        // Store OTP in the database
        db.query('UPDATE users SET password_reset_otp = ?, password_otp_expiry = ? WHERE email = ?', [OTP, expiry, email], (err) => {
            if (err) 
                return res.status(500).json({ error: 'Database error' });

            // Send email with the OTP to the user
            const mailOptions = {
                from: process.env.MAIN_EMAIL, // get .env file main email
                to: email,
                subject: 'Password Reset Request',
                html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #fff;">
                            <h2 style="color: #4CAF50;">Password Reset Request</h2>
                            <p>You have requested to reset your password. Please use the OTP below to complete the process:</p>

                            <div style="font-size: 20px; font-weight: bold; padding: 10px; background-color: #b3b1b1; border: 1px solid #ddd; display: inline-block;">
                                ${OTP}
                            </div>

                            <p>This OTP is valid for <strong>${process.env.OTP_EXPIRATION_TIME} minute</strong>.</p>
                            <p>If you did not request a password reset, please ignore this email or contact support.</p>
                            
                            <hr style="border: none; border-top: 1px solid #eee;">

                            <p style="font-size: 12px; color: #999;">
                                This is an automated message, please do not reply.
                            </p>
                        </div>
                        `
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) 
                    return res.status(500).json({ error: 'Error sending email' });

                res.json({ 
                    OTP: OTP, // for developing. show OTP
                    message: 'Password reset email sent' 
                });
            });
        });
    });

}// end module



// send OTP module
const verifyOTP = (req, res)=> {
    const { email, password_reset_otp } = req.body; // get OTP from user

     // query for check to the password_reset_otp column
     db.query('SELECT password_reset_otp FROM users WHERE email = ?', [email], (err, result) => {
        if (err){
            return res.status(500).json({ error: 'Database error' });
        }

        // check database OTP has or not
        if (result.length === 0){
            return res.status(404).json({ error: 'OTP not found' });
        }

        // Get the OTP from the first row (check if result[0] exists)
        const OTP = result[0]?.password_reset_otp;

        if (!OTP) {
            return res.status(404).json({ error: 'OTP not found in the database' });
        }

        
        // check user input password_reset_otp and database OTP
        if(password_reset_otp === String(OTP)){
            return res.status(200).json({ message: 'OTP matches' });
        }else{
            return res.status(404).json({ message: 'OTP wrong' });
        }

    });

} // end module


// reset password module
const resetPassword = (req, res)=> {
    const {email, Password} = req.body; // get password from client

        // user new password convert md5 and assign it to hashedPassword
        const hashedPassword = md5(Password);

    // query for identify the user
    db.query('UPDATE users SET Password = ? WHERE email = ?', [hashedPassword, email],(err, result) => {
        if (err) 
            return res.status(500).json({ error: 'Database error' });

        // checking whether any user record was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'password not updated, Enter Your Email and get OTP from email again' });
        }
        
        res.status(200).json({ message: 'User password reset successfully' });
    });

}// end module




// export moduless
module.exports = {
    getOTP,
    verifyOTP,
    resetPassword
};