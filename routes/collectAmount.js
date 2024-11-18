const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller
const collectAmountFromCustomer = require('../controllers/collectAmount/fromCustomerController');
const showTodayCollection = require('../controllers/collectAmount/showTodayCollection');



// store customer payment details
router.post('/all', auth,collectAmountFromCustomer.collectAmount);

router.get('/dayCollection/:EmpCode', auth,showTodayCollection.showTodayCollection);


// Export the router
module.exports = router;