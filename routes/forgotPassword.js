const express = require('express');
const router = express.Router();

//define controller
const forgotPasswordController = require('../controllers/auth/forgotPasswordController');

// enter user email for get OTP
router.post('/get-otp', forgotPasswordController.getOTP);

// enter OTP and send to the server
router.post('/send-otp', forgotPasswordController.sendOTP);

// password reset
router.post('/reset-password', forgotPasswordController.resetPassword);

// Export the router
module.exports = router;