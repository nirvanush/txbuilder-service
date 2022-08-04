'use strict';
const ErgoWallet = require('isomorphic-wallet').default;

module.exports.handler = async (event) => {
  const apiToken = event.headers['x-api-key'];

  if (!apiToken || apiToken !== process.env.INTERNAL_API_TOKEN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Rejected' }),
    };
  }

  const { body: unsignedTx } = event;
  console.log('received-body', unsignedTx);

  const mintWallet = await new ErgoWallet().fromMnemonics(process.env.SEED || '');

  mintWallet.setPublicAddress(process.env.PK);

  try {
    const signedTx = await mintWallet.sign_tx(JSON.parse(unsignedTx));
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
