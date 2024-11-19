const express = require('express');
const { sendTransaction, getTransactionStatus } = require('../controllers/transactionController');
const router = express.Router();

router.post('/transaction', sendTransaction);
router.get('/transaction', getTransactionStatus);

module.exports = router;
