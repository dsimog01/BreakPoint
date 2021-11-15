import React, { Component } from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../../media/tennis.svg';
import Login from '../Login/Login';
import './Navigation.css';


class Navigation extends Component {
    render() {
        return (
          <Navbar>
              <Container>
                <Navbar.Brand>
                  <div className="border border-5 border-dark rounded-pill">
                  
                    <img src={logo} className="App-logo d-inline-block align-top" alt="logo" />{' '}
                    <span><b>BreakPoint</b></span>
                    
                  </div>

                </Navbar.Brand>
              </Container>
            </Navbar>
          );
    }
}

export default Navigation;