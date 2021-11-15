import React, { Component } from 'react';
import babolat from '../../media/rackets/babolat.jpg';
import wilson from '../../media/rackets/wilson.jpg';
import tecnifibre from '../../media/rackets/tecnifibre.jpg';
import head from '../../media/rackets/head.jpg';
import yonex from '../../media/rackets/yonex.jpg';
import dunlop from '../../media/rackets/dunlop.jpg';
import pro from '../../media/rackets/pro.jpg';


class Card extends Component {

    constructor(props){

      super(props);

      this.state = {
        imageDictionary: {
          "Babolat": babolat,
          "Wilson": wilson,
          "Tecnifibre": tecnifibre,
          "Head": head,
          "Yonex": yonex,
          "Dunlop": dunlop,
          "Pro": pro
        }
      }


    }
    
    render() {
        return(
          <div id="card-container" className="card mt-4">
            <div className="card-header">
              <h3>{this.props.racket.brand}</h3>
              <span className="badge badge-pill ml-2 text-danger"> 
                {this.props.racket.model} 
              </span>
            </div>
            <div className="card-body">
              <div className="racketImageContainer">
                <img src={this.state.imageDictionary[this.props.racket.brand]} alt="racketImage"/>
              </div>
              <p>{this.props.racket.price}$</p>
              <p>{this.props.racket.stringPattern} {this.props.racket.weight}g</p>
              <p>{this.props.racket.length}in {this.props.racket.headSize}in2</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-success" onClick={this.props.onClickDelete}>Select</button>
            </div>
          </div>
        );
    }
}

export default Card;