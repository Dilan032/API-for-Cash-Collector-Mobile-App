const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller
const allCustomerDetailsController = require('../controllers/customer/allCustomerDetailsController');
const searchCustomerController = require('../controllers/customer/searchCustomerController');

// get all customer details
router.get('/all-details', auth,allCustomerDetailsController.allCustomerDetails);
router.get('/search', auth,searchCustomerController.searchCustomer);


// Export the router
module.exports = router;