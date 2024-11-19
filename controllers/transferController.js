const db = require('../db');

exports.transferMoney = async (req, res) => {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid input data' });
    }

    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        const { rows } = await client.query('SELECT balance FROM accounts WHERE id = $1 FOR UPDATE', [fromAccountId]);
        if (rows.length === 0) {
            throw new Error('Sender account not found');
        }

        const senderBalance = rows[0].balance;
        if (senderBalance < amount) {
            throw new Error('Insufficient funds');
        }

        await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromAccountId]);

        await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toAccountId]);

        await client.query('COMMIT');
        res.json({ success: true, message: 'Transfer completed successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
};
