const express = require('express');
const { sendTransaction, getTransactionStatus } = require('../controllers/transactionController');
const { transferMoney } = require('../controllers/transferController');

const router = express.Router();

router.post('/transaction', sendTransaction);
router.get('/transaction', getTransactionStatus);

router.post('/transfer', transferMoney);

module.exports = router;
