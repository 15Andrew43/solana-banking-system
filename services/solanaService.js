const { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

exports.sendTransaction = async (fromPrivateKey, toPublicKey, amount) => {
    try {
        const fromKeypair = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'base64'));
        const toPubKey = new PublicKey(toPublicKey);

        if (isNaN(amount) || amount <= 0) {
            throw new Error('Invalid amount specified');
        }

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeypair.publicKey,
                toPubkey: toPubKey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
        return signature;
    } catch (error) {
        throw new Error(`Transaction failed: ${error.message}`);
    }
};

exports.getTransactionStatus = async (transactionSignature) => {
    try {
        const status = await connection.getSignatureStatus(transactionSignature);
        if (status && status.value) {
            return status.value.confirmationStatus || 'pending';
        } else {
            throw new Error('Transaction status not found');
        }
    } catch (error) {
        throw new Error(`Failed to get transaction status: ${error.message}`);
    }
};
