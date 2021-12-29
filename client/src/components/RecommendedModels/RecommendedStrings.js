import React from 'react';

import RecommendedStringCard from '../Card/RecommendedStringCard';

export default function RecommendedStrings(props) {

    const recommendedStrings = props.strings.map((string, i) => {
        return (
            <div className="col-md-4">
                <RecommendedStringCard string={string} number={i+1}/>
            </div>
        )
    });

    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Recommended Strings </h2>  
            <div className="container row">
                {recommendedStrings}    
            </div>
        </div>
    )
}