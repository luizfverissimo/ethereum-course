const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();

const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  process.env.MNEUMONIC,
  process.env.RINKEBY_ENDPOINT
);

const web3 = new Web3(provider);

(async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('💳 Attempting to deploy from account: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Olá Mundão!']
    })
    .send({
      gas: '1000000',
      from: accounts[0]
    });

  console.log('📬 Contract deployed to: ', result.options.address)
  provider.engine.stop()
})();
