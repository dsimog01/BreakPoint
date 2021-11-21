import React, { Component } from 'react';
import { Rating } from '@mui/material';

import babolat from '../../media/strings/babolat.jpg';
import prince from '../../media/strings/prince.jpg';
import solinco from '../../media/strings/solinco.jpg';
import wilson from '../../media/strings/wilson.jpg';
import yonex from '../../media/strings/yonex.jpg';

class StringCard extends Component {

    constructor(props){

      super(props);

      this.state = {
        imageDictionary: {
          "Babolat": babolat,
          "Prince": prince,
          "Solinco": solinco,
          "Wilson": wilson,
          "Yonex": yonex
        },
        stringBrand: this.props.string.brand.toLowerCase()
      }

    }
    
    render() {
        return(
          <div id="card-container" className="card mt-4">
            <div className="card-header">
              <h3>{this.props.string.brand}</h3>
              <span className="badge badge-pill ml-2 text-danger"> 
                {this.props.string.model} 
              </span>
            </div>
            <div className="card-body">
              <div className="racketImageContainer">
                <img src={this.state.imageDictionary[this.props.string.brand]} alt="stringImage"/>
              </div>
              <p>{this.props.string.type}$</p>
              <p>{this.props.string.composition}</p>
              <p>{this.props.string.gauge_mm}mm</p>
            </div>
            <div className="card-footer">
              <Rating name={this.state.stringBrand} /*onChange={(event, newValue) => { setValue(newValue);}}*//>
            </div>
          </div>
        );
    }
}

export default StringCard;