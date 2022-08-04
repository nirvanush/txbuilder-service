'use strict';
const ErgoWallet = require('isomorphic-wallet').default;
const Transaction = require('ergoscript').default;

module.exports.handler = async (event) => {
  const apiToken = event.headers['x-api-key'];

  if (!apiToken || apiToken !== process.env.INTERNAL_API_TOKEN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Rejected' }),
    };
  }

  const { config } = JSON.parse(event.body);
  console.log('received-body', config);
  const mintWallet = await new ErgoWallet().fromMnemonics(process.env.SEED || '');

  mintWallet.setPublicAddress(process.env.PK);

  const unsignedTx = await (new Transaction(config, { wallet: mintWallet })).build();


  try {
    const signedTx = await mintWallet.sign_tx(unsignedTx.toJSON());
    const hash = await mintWallet.submit_tx(signedTx);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK', hash }),
    };

  } catch(e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error' }),
    };
  }

};
