const express = require('express');
const router = express.Router();

//define controller
const allCustomerDetailsController = require('../controllers/customer/allCustomerDetailsController');
const searchCustomerController = require('../controllers/customer/searchCustomerController');

// get all customer details
router.get('/all-details', allCustomerDetailsController.allCustomerDetails);
router.get('/search', searchCustomerController.searchCustomer);


// Export the router
module.exports = router;