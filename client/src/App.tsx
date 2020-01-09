import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from './static/images/wrct_logo.png';
import './static/sass/App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar className="App-navbar">
        <Navbar.Brand>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to WRCT!</h1>
          </header>
        </Navbar.Brand>
        <Nav className="justify-content-end">
          <Nav.Item>
            <Nav.Link className="App-nav-link" href="">My Account</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="App-nav-link" href="">Programs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="App-nav-link" href="">Artists</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="App-nav-link" href="">Albums</Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
      <p className="App-intro">TODO: Build the whole site</p>
    </div>
  );
};

export default App;
