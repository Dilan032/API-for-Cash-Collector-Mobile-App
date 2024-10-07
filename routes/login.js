const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// define login controllers
const pinLoginController = require('../controllers/auth/pinLoginController');
const nameLoginController = require('../controllers/auth/nameLoginController');

router.post('/pin', pinLoginController.pinLogin );
router.post('/userName', nameLoginController.userNameLogin );

module.exports = router;