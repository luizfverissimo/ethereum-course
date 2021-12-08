import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import web3 from './web3';
import lottery from './lottery';

import './App.css';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState(0);
  const [lastWinner, setLastWinner] = useState('');

  useEffect(() => {
    (async () => {
      const managerResponse = await lottery.methods.manager().call();
      setManager(managerResponse);

      const playersResponse = await lottery.methods.getPlayers().call();
      setPlayers(playersResponse);

      const balanceResponse = await web3.eth.getBalance(
        lottery.options.address
      );
      setBalance(balanceResponse);

      const winner = await lottery.methods.lastWinner().call();
      setLastWinner(winner);
    })();
  }, []);

  async function handleEnterLottery(event) {
    event.preventDefault();

    try {
      const accounts = await web3.eth.getAccounts();

      const transaction = lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });

      toast.promise(transaction, {
        loading: 'Waiting on transaction...',
        success: "🎉 You've entered the lottery!",
        error: 'Something went wrong! Try again. 🙁'
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function handlePickWinner() {
    const accounts = await web3.eth.getAccounts();

    if (manager !== accounts[0]) {
      toast.error('You are not the manager!')
      return;
    }
    try {
      const transaction = lottery.methods.pickWinner().send({
        from: accounts[0]
      });

      await toast.promise(transaction, {
        loading: 'Waiting on transaction...',
        success: "🎉 A winner was picked!",
        error: 'Something went wrong! Try again. 🙁'
      });

      const winner = await lottery.methods.lastWinner().call();
      toast.success(`🎉 The winner is ${winner}!`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='App'>
      <Toaster position='top-center' />
      <header className='App-header'>
        <h2>Lottery Contract</h2>
        <div className='container'>
          <div className='column'>
            <h4>💰 Lottery Balance:</h4>
            <p>{web3.utils.fromWei(balance, 'ether')} ether</p>
          </div>
          <div className='column'>
            <h4>👤 Lottery Players:</h4>
            <p>{players.length}</p>
          </div>
        </div>
        <div className='container'>
          <h3>🏆 Last Winner:</h3>
          <p>{lastWinner}</p>
        </div>
        <div className='container'>
          <h3>Manager Address:</h3>
          <p>{manager}</p>
        </div>
        <hr />
        <form onSubmit={handleEnterLottery}>
          <h4>Want to try your lucky? 🍀</h4>
          <div className='container'>
            <label>⤵️ Amount of ether to enter:</label>
            <input
              type='number'
              step='0.001'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <button type='submit'>Enter the lottery →</button>
        </form>
        <hr />
        <div className='container'>
          <h4>Read to picky a winner?</h4>
          <button onClick={handlePickWinner}>Pick a winner! 💰</button>
        </div>
      </header>
    </div>
  );
}
export default App;
