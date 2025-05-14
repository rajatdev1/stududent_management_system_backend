const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { auth } = require('../middleware/auth');

router.post('/', auth, feeController.createFeePayment);
router.get('/student/:studentId', auth, feeController.getFeePaymentsByStudent);
router.put('/:id', auth, feeController.updateFeePayment);
router.delete('/:id', auth, feeController.deleteFeePayment);

module.exports = router;