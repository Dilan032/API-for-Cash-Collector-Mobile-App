const express = require('express');
const router = express.Router();

// define controllers
const pinLoginController = require('../controllers/auth/pinLoginController');
const nameLoginController = require('../controllers/auth/nameLoginController');


// for login (pinLogin) and (user name & password login)
router.post('/pinLogin', pinLoginController.pinLogin );
router.post('/userNameLogin', nameLoginController.userNameLogin );




// Export the router
module.exports = router;