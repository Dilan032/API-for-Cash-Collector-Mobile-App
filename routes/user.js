const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userDetailsController = require('../controllers/userProfile/userDetailsController');
const userPasswordController = require('../controllers/userProfile/userPasswordController');

const allUserDetailsController = require('../controllers/user/allUserDetailsController');
const searchUsersController = require('../controllers/user/searchUsersController');

// get loging user details
router.get('/accountDetails', auth,userDetailsController.userDetails);

// update user deails
router.put('/updateDetails', auth,userDetailsController.updateUserDetails);

// update user password
router.put('/updateUserPassword', auth,userPasswordController.updateUserPassword);



// get all users details
router.get('/all-details', auth,allUserDetailsController.allUserDetails);

// search all users details
router.get('/search', auth,searchUsersController.searchUser);



// Export the router
module.exports = router;