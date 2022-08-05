'use strict';
const ErgoWallet = require('isomorphic-wallet').default;
const Transaction = require('ergoscript').default;

module.exports.txBuilder = async (event) => {
  const apiToken = event.headers['x-api-key'];

  // if (!apiToken || apiToken !== process.env.INTERNAL_API_TOKEN) {
  //   return {
  //     statusCode: 401,
  //     body: JSON.stringify({ message: 'Rejected' }),
  //   };
  // }

  const { config, userAddress } = JSON.parse(event.body);

  const mintWallet = await new ErgoWallet().fromMnemonics('');

  mintWallet.setPublicAddress(userAddress);

  const unsignedTx = await (new Transaction(config, { wallet: mintWallet })).build();

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK', unsignedTx: unsignedTx.toJSON() }),
    };

  } catch(e) {
    console.error(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Error',  error: e.message }),
    };
  }
};
