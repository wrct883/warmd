import React, { Component } from 'react';
import logo from './static/images/wrct_logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to WARMD</h1>
        </header>
        <p className="App-intro">
          TODO: Build the whole site
        </p>
      </div>
    );
  }
}

export default App;
