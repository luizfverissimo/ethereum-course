const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let accounts, lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });

    console.log(lottery)
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('has manager', async () => {
    const contractManager = await lottery.methods.manager().call();
    assert.equal(contractManager, accounts[0]);
  });

  it('can enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.011', 'ether')
    });
    const players = await lottery.methods.getPlayers().call();

    assert.ok(players.includes(accounts[1]));
    assert.equal(1, players.length);
  });

  it('can enter with multiple accounts', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.011', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.011', 'ether')
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.011', 'ether')
    });

    const players = await lottery.methods.getPlayers().call();

    assert.ok(players.includes(accounts[0]));
    assert.ok(players.includes(accounts[1]));
    assert.ok(players.includes(accounts[2]));
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 1
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('sends money to the winner and reset the players', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    const players = await lottery.methods.getPlayers().call();

    assert(difference > web3.utils.toWei('0.9', 'ether'));
    assert(players.length === 0);
  });

  //My solution:

  // it('can fail enter with no payment', async () => {
  //   assert.rejects(async () => {
  //     await lottery.methods.enter().send({
  //       from: accounts[1]
  //     });
  //   });
  // });

  // it('can list all players', async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[1],
  //     value: web3.utils.toWei('0.011', 'ether')
  //   });
  //   const players = await lottery.methods.getPlayers().call();

  //   assert.ok(players.includes(accounts[1]));
  // });

  // it('manager can pick a winner', async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[1],
  //     value: web3.utils.toWei('0.011', 'ether')
  //   });

  //   const { transactionHash } = await lottery.methods.pickWinner().send({
  //     from: accounts[0]
  //   });

  //   assert.ok(transactionHash);
  // });

  // it('not manager can pick a winner', async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[1],
  //     value: web3.utils.toWei('0.011', 'ether')
  //   });

  //   assert.rejects(async () => {
  //     const { transactionHash } = await lottery.methods.pickWinner().send({
  //       from: accounts[1]
  //     });
  //   });
  // });
});
