const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller
const collectAmountFromCustomer = require('../controllers/collectAmount/fromCustomerController');



// store customer payment details
router.post('/all', collectAmountFromCustomer.collectAmount);


// Export the router
module.exports = router;