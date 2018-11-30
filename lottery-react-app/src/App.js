import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = { 
    manager: '',
    players: [],
    balance: '0',
    value: '',
    message: ''
  }

  componentDidMount() {
    web3.eth.getAccounts().then(console.log);
    this.init();
  }

  async init() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const v = this.state.value;
    this.setState({ message: 'Waiting...', value: '' });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(v, 'ether')
    });
    this.setState({ message: 'Welcome to the lottery!!' });
    this.init();
  };

  onPickWinner = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting...' });
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const winner = await lottery.methods.lastWinner().call();
    this.setState({ message: 'Winner picked!! And it is: ' + winner });
    this.init();
  }
  
  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>This contract is managed by: {this.state.manager}</p>
        <p>Number of participants: {this.state.players.length}</p>
        <p>Balance: {web3.utils.fromWei(this.state.balance, 'ether')} ETH</p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <label htmlFor='amount'>Amount ETH: </label>
          <input name='amount' value={this.state.value} onChange={ event => this.setState({ value: event.target.value }) }

          />
          <button action='submit'>Enter</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onPickWinner}>Pick a winner!</button>
        <hr />
      </div>
    );
  }
}

export default App;
