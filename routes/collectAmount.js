const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller
const collectAmountFromCustomer = require('../controllers/collectAmount/fromCustomerController');
const showTodayCollection = require('../controllers/collectAmount/showTodayCollection');



// store customer payment details
router.post('/all', collectAmountFromCustomer.collectAmount);

router.get('/dayCollection', showTodayCollection.showTodayCollection);


// Export the router
module.exports = router;