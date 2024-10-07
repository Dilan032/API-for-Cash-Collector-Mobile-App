const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const accountDetailsController = require('../controllers/userProfile/detailsController');

router.get('/AccountDetails', auth,accountDetailsController.userDetails);

// Export the router
module.exports = router;