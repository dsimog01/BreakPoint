import React, { Component } from 'react';
import Card from '../Card/StringCard';
import strings from '../../data/stringsSpecs.json';

class StringSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strings: strings
        };
    }

    render(){

        const storedStrings = this.state.strings.stringsSpecs.map((stringItem, i) => {
            return (
              <div className="col-md-4">
                <Card string={stringItem}/>
              </div>
            )
          });

        return(
            <div className="container mt-5 p-4 border rounded-3">
                <h2> Could you rate the following strings?  </h2>  
                <div className="container row">
                    {storedStrings}
                </div>
            </div>
        );
    }
}

export default StringSelector;