import React from 'react';

export default function RecommendedCard(props) {

    const cardRef = React.useRef();

    return (
        <div className="card mt-4" ref={cardRef}>
            <h5 className="card-header">Racket {props.number}</h5>
            <div className="card-body">
                <img className='card-img mb-2' src={props.racket.image} alt="racketImage"/>
                <h5 className="card-title">{props.racket.brand}</h5>
                <div className='card-text'>
                    <p>{props.racket.price}$</p>
                    <p>{props.racket.stringPattern} {props.racket.weight}g</p>
                    <p>{props.racket.length}in {props.racket.headSize}in2</p>
                </div>
            </div>
        </div>
    )
}
