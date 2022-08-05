# Lite weight javascript service to build transaction

Can run on aws serverless lambda or on a server with `npm run dev`;
I suggest trying lambda because it's free.

### Based on: 
- [ergoscript.js](https://github.com/nirvanush/ergoscript) - transaction builder library
- [isomorphic-wallet](https://github.com/nirvanush/isomorphic-wallet) - in code wallet with same api as dapp connector.


## How to start
```
git clone https://github.com/nirvanush/txbuilder-service
cd txbuilder-service
npm i 
npm run start

Will run on port 5000
```

## How to use:
Use the tx configuration syntax as described it [ergoscript.js](https://github.com/nirvanush/ergoscript) README.md;

Here is the example of generating a simple transaction of sending 5 Comet:
```
  const response = await fetch('yourhost.com/build_tx', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "config": [{
            "funds": {
                "ERG": 10000000,
                "tokens": [{
                    "tokenId": "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
                    "amount": 5
                }]
            },
            "toAddress": "<recipient address>",
            "additionalRegisters": {
                value: '40', type: 'Int'
            }
        }],
        "userAddress": await ergo.get_change_address() // this is the public address of user that will have to sign this tx later.
    })
  }).then(resp => resp.json());

  const { unsignedTx } = response;

  // later you can sign this tx using dapp connector
  // and submit
  const signedTx = ergo.sign_tx(unsignedTx)
  const hash = ergo.submit_tx(signedTx);
```

### TODO:
- Custom explorer endpoint, currently using public.
