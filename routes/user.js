const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userDetailsController = require('../controllers/userProfile/userDetailsController');

// get loging user details
router.get('/AccountDetails', auth,userDetailsController.userDetails);



// Export the router
module.exports = router;