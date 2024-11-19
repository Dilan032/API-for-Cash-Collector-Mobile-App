const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

//define controller

const cashController = require('../controllers/collectAmount/cashController');
const bankChequeController = require('../controllers/collectAmount/bankChequeController');
const showTodayCollection = require('../controllers/collectAmount/showTodayCollection');



router.post('/cashCollect', auth,cashController.cashCollect);
router.post('/bankCheque', auth,bankChequeController.bankCheque);

router.get('/dayCollection/:EmpCode', auth,showTodayCollection.showTodayCollection);


// Export the router
module.exports = router;