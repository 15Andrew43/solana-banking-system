const solanaService = require('../services/solanaService');

exports.sendTransaction = async (req, res) => {
    try {
        const { fromPrivateKey, toPublicKey, amount } = req.body;
        if (!fromPrivateKey || !toPublicKey || !amount) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const result = await solanaService.sendTransaction(fromPrivateKey, toPublicKey, amount);
        return res.json({ success: true, transactionSignature: result });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTransactionStatus = async (req, res) => {
    try {
        const { transactionSignature } = req.query;
        if (!transactionSignature) {
            return res.status(400).json({ success: false, error: 'Missing transaction signature' });
        }

        const status = await solanaService.getTransactionStatus(transactionSignature);
        return res.json({ success: true, status });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
