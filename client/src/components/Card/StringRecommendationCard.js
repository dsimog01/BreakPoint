import React from 'react';

export default function RecommendedStringCard(props) {

    return (
        <div className="card mt-4">
            <h5 className="card-header">String {props.number}</h5>
            <div className="card-body">
                <img className='card-img mb-2' src={props.recommendedString.image} alt="racketImage"/>
                <h5 className="card-title">{props.recommendedString.brand}</h5>
                <div className='card-text'>
                    <p>{props.recommendedString.composition}</p>
                    <p>{props.recommendedString.type}</p>
                    <p>{props.recommendedString.gauge}mm</p>
                </div>
            </div>
        </div>
    )
}