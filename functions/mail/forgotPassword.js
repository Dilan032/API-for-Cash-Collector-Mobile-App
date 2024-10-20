require('dotenv').config();

// this is email structure


const forgotPasswordOTPEmailStructure = (email, OTP) => {
    // Send email with the OTP to the user  
    const mailOptions = {
        from: process.env.MAIN_EMAIL, // Get the email from .env file
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Password Reset Request</h2>
                <p>You have requested to reset your password. Please use the OTP below to complete the process:</p>

                <div style="font-size: 20px; font-weight: bold; padding: 10px; background-color: #f1f1f1; border: 1px solid #ddd; display: inline-block; color: #333;">
                    ${OTP}
                </div>

                <p>This OTP is valid for <strong>${process.env.OTP_EXPIRATION_TIME} minutes</strong>.</p>
                <p>If you did not request a password reset, please ignore this email or contact support.</p>
                
                <hr style="border: none; border-top: 1px solid #eee;">

                <p style="font-size: 12px; color: #999;">
                    This is an automated message, please do not reply.
                </p>
            </div>
        `
    };
    return mailOptions;
};



module.exports = { forgotPasswordOTPEmailStructure };