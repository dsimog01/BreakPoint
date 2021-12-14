import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../../media/tennis.svg';
import AuthNav from './AuthNav';
import './Navigation.css';

export default function Navigation(props) {
  return (
    <Navbar>
      <Container>
        <Navbar.Brand>
          <div id="nav-container" class="d-flex justify-content-around">
            <div id="main-logo" className="border border-5 border-dark rounded-pill">
            
              <img src={logo} className="App-logo d-inline-block align-top" alt="logo" />{' '}
              <span id="name"><b>BreakPoint</b></span>
              
            </div>

            <div class="ml-auto p-2">
              <AuthNav id="login-button"/>
            
            </div>

          </div>
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}
