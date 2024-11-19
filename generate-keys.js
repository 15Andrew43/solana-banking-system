const { Keypair } = require('@solana/web3.js');

const generateKeys = () => {

    const keypair = Keypair.generate();


    const privateKeyArray = Array.from(keypair.secretKey);


    const privateKeyBase64 = Buffer.from(keypair.secretKey).toString('base64');
    

    const publicKey = keypair.publicKey.toString();

    console.log('Public Key:', publicKey);
    console.log('Private Key (array):', privateKeyArray);
    console.log('Private Key (base64):', privateKeyBase64);
};

generateKeys();
