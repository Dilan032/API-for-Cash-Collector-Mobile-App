const express = require('express');
const router = express.Router();

// define controllers
const pinLoginController = require('../controllers/auth/pinLoginController');
const nameLoginController = require('../controllers/auth/nameLoginController');
const logOutController = require('../controllers/auth/logOutController');


// for login (pinLogin) and (user name & password login)
router.post('/pinLogin', pinLoginController.pinLogin );
router.post('/userNameLogin', nameLoginController.userNameLogin );

// for log out
//router.post('/logOut', logOutController.logOut );




// Export the router
module.exports = router;