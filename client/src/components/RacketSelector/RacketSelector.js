import React, { Component } from 'react';
import Card from '../Card/Card';
import rackets from '../../data/racketsSpecs.json';
import './RacketSelector.css';

class RacketSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rackets: rackets
        };
    }

    render(){

        const racket = {
            "brand": "Babolat",
            "price": 239.95,
            "headSize": 98,
            "length": 27,
            "weight": 315,
            "stringPattern": "16x19"
        };

        const storedRackets = this.state.rackets.racketsSpecs.map((racketItem, i) => {
            return (
              <div className="col-md-4">
                <Card racket={racketItem}/>
              </div>
            )
          });

        return(
            <div className="container mt-5 p-4 border rounded-3">
                <h2> Would you play with any of these rackets?  </h2>  
                <div className="container row">
                    {storedRackets}
                </div>
            </div>
        );
    }
}

export default RacketSelector;