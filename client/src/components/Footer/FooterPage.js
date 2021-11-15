import React, { Component } from "react";
import nodeLogo from '../../media/Node.js_logo.svg';
import neoLogo from '../../media/Neo4j_logo.svg';
import reactLogo from '../../media/React_logo.svg';
import './FooterPage.css';

class FooterPage extends Component {
  render(){
    return (
      <div className="footer">
        <div>
          <h1>Ready to upgrade your tennis?</h1>
          <p id="subtitle">Start using BreakPoint Recommender and find the racket that suits you best!</p>
        </div>
        
        <div className="footerImages">
          <img className="footerImage" src={nodeLogo} alt="Nodejs logo"/>
          <img className="footerImage" src={neoLogo} alt="Neo4j logo"/>
          <img className="footerImage" src={reactLogo} alt="React logo"/>
            <p>BreakPoint | Tennis Racket Recommender | SIBI-21/22 | Universidad de León</p>
        </div>
        
        <div class="community">
          <ul>
            <li><a href="http://sicodinet.unileon.es/" target="_blank" rel="noopener noreferrer">Sicodinet</a></li>
            <li><a href="https://osf.io/v4d7r/" target="_blank" rel="noopener noreferrer">OSF</a></li>
            <li><a href="https://github.com/dsimog01/racket-recommendation-system" target="_blank" rel="noopener noreferrer">Github</a></li>
            <li><a href="https://neo4j.com/" target="_blank" rel="noopener noreferrer">Neo4j</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default FooterPage;