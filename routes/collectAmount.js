const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller
// const collectAmountFromCustomer = require('../controllers/collectAmount/fromCustomerController');

const cashController = require('../controllers/collectAmount/cashController');
const showTodayCollection = require('../controllers/collectAmount/showTodayCollection');



// store customer payment details
// router.post('/all', auth,collectAmountFromCustomer.collectAmount);


router.post('/cashCollect', auth,cashController.cashCollect);

router.get('/dayCollection/:EmpCode', auth,showTodayCollection.showTodayCollection);


// Export the router
module.exports = router;