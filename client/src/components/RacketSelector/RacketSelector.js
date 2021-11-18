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

        const storedRackets = this.state.rackets.racketsSpecs.map((racketItem, i) => {
            return (
              <div className="col-md-4">
                <Card racket={racketItem}/>
              </div>
            )
          });

        return(
            <div className="container mt-5 p-4 border rounded-3">
                <h2> Could you rate the following rackets?  </h2>  
                <div className="container row">
                    {storedRackets}
                </div>
            </div>
        );
    }
}

export default RacketSelector;