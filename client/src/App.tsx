import React from 'react';

import Navbar from 'react-bootstrap/Navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './static/images/wrct_logo.png';
import './static/sass/App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to WRCT!</h1>
        <Navbar bg="dark" />
      </header>
      <p className="App-intro">
        TODO: Build the whole site
      </p>
    </div>
  );
};

export default App;
