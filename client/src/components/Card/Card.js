import React from 'react';
import babolat from '../../media/rackets/babolat.jpg';
import wilson from '../../media/rackets/wilson.jpg';
import tecnifibre from '../../media/rackets/tecnifibre.jpg';
import head from '../../media/rackets/head.jpg';
import yonex from '../../media/rackets/yonex.jpg';
import dunlop from '../../media/rackets/dunlop.jpg';
import pro from '../../media/rackets/pro.jpg';

import { Rating } from '@mui/material';


export default function Card(props) {
  //const [rate, setRate] = useState(null);

  let imageDictionary = {
    "Babolat": babolat,
    "Wilson": wilson,
    "Tecnifibre": tecnifibre,
    "Head": head,
    "Yonex": yonex,
    "Dunlop": dunlop,
    "Pro": pro
  };

  let racketBrand = props.racket.brand.toLowerCase();

  function saveRating(newValue){
    let newRatings = props.ratings;
    newRatings[props.racket.modelID] = newValue;
    console.log(newRatings);
    props.updateRatings(newRatings);
  }

  return (
    <div id="card-container" className="card mt-4">
    <div className="card-header">
      <h3>{props.racket.brand}</h3>
      <span className="badge badge-pill ml-2 text-danger"> 
        {props.racket.model} 
      </span>
    </div>
    <div className="card-body">
      <div className="racketImageContainer">
        <img src={imageDictionary[props.racket.brand]} alt="racketImage"/>
      </div>
      <p>{props.racket.price}$</p>
      <p>{props.racket.stringPattern} {props.racket.weight}g</p>
      <p>{props.racket.length}in {props.racket.headSize}in2</p>
    </div>
    <div className="card-footer">
      <Rating className={"rating-"+racketBrand} onChange={(event, newValue) => saveRating(newValue)}/*onChange={(event, newValue) => { props.setValue(racketBrand, newValue);}}*//>
    </div>
  </div>
  )
}
