const express = require('express');
const router = express.Router();

//define controller
const allCustomerDetailsController = require('../controllers/customer/allCustomerDetailsController');

// get all customer details
router.get('/all-details', allCustomerDetailsController.allCustomerDetails);


// Export the router
module.exports = router;