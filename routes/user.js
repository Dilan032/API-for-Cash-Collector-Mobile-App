const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userDetailsController = require('../controllers/userProfile/userDetailsController');
const userPasswordController = require('../controllers/userProfile/userPasswordController');

// get loging user details
router.get('/accountDetails', auth,userDetailsController.userDetails);
router.put('/updateDetails', auth,userDetailsController.updateUserDetails);

// update user password
router.put('/updateUserPassword', auth,userPasswordController.updateUserPassword);



// Export the router
module.exports = router;