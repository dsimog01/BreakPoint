import React from 'react';
import { Rating } from '@mui/material';

import babolat from '../../media/strings/babolat.jpg';
import prince from '../../media/strings/prince.jpg';
import solinco from '../../media/strings/solinco.jpg';
import wilson from '../../media/strings/wilson.jpg';
import yonex from '../../media/strings/yonex.jpg';


export default function StringCard(props) {
  let imageDictionary = {
    "Babolat": babolat,
    "Prince": prince,
    "Solinco": solinco,
    "Wilson": wilson,
    "Yonex": yonex
  };

  let stringBrand = props.string.brand.toLowerCase();

  return (
    <div id="card-container" className="card mt-4">
      <div className="card-header">
        <h3>{props.string.brand}</h3>
        <span className="badge badge-pill ml-2 text-danger"> 
          {props.string.model} 
        </span>
      </div>
      <div className="card-body">
        <div className="racketImageContainer">
          <img src={imageDictionary[props.string.brand]} alt="stringImage"/>
        </div>
        <p>{props.string.type}</p>
        <p>{props.string.composition}</p>
        <p>{props.string.gauge_mm}mm</p>
      </div>
      <div className="card-footer">
        <Rating name={stringBrand} /*onChange={(event, newValue) => { setValue(newValue);}}*//>
      </div>
    </div>
  )
}