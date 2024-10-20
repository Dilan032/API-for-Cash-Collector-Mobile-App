const nodemailer = require('nodemailer');

const mailConfigDetails = () =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIN_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    return transporter;
}

module.exports = { mailConfigDetails };