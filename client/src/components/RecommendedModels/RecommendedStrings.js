import React from 'react';

import StringRecommendationCard from '../Card/StringRecommendationCard';

export default function RecommendedStrings(props) {

    const recommendedStrings = props.strings.map((recommendedString, i) => {
        return (
            <div className="col-md-4">
                <StringRecommendationCard recommendedString={recommendedString} number={i+1}/>
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