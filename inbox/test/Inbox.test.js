const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const { interface, bytecode } = require('../compile');

const web3 = new Web3(ganache.provider()); //isso vai mudar dependendo da network utilizada.

let accounts, inbox;
const initialString = 'Olá Mundo!';
const modifiedString = 'Olá Mundão!';

beforeEach(async () => {
  //get a list of all accounts
  accounts = await web3.eth.getAccounts();

  //use one of those to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [initialString]
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialString);
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage(modifiedString).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, modifiedString);
  });
});

//Test Lesson

// class Car {
//   park() {
//     return 'stopped';
//   }
//   drive() {
//     return 'vroom';
//   }
// }

// let car
// beforeEach(() => {
//   car = new Car();
// })

// describe('Car', () => {

//   it('can park', () => {
//     assert.equal(car.park(), 'stopped');
//   });

//   it('can drive', () => {
//     assert.equal(car.drive(), 'vroom');
//   });
// });
