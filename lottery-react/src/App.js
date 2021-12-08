import { useEffect, useState } from 'react';

import web3 from './web3';
import lottery from './lottery';

import './App.css';
import Spinner from './components/Spinner';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

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
    })();
  }, []);

  async function handleEnterLottery(event) {
    setIsLoading(false);
    event.preventDefault();

    try {
      setIsLoading(true);
      setStatus('⏳ Waiting on transaction...');
      const accounts = await web3.eth.getAccounts();

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });
      setIsLoading(false);
      setStatus('🎉 You have entered the lottery! Good luck!');
    } catch (err) {
      setIsLoading(false);
      setStatus('❌ You have not entered the lottery. Try again!');
    }
  }

  return (
    <div className='App'>
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
          <h3>Manager Address:</h3>
          <p>{manager}</p>
        </div>
        <hr />
        <form onSubmit={(e) => handleEnterLottery(e)}>
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
          {isLoading && <Spinner />}
          {status && <p>{status}</p>}
        </form>
      </header>
    </div>
  );
}
export default App;
