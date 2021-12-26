import React from 'react';

import RecommendedCard from '../Card/RecommendedCard';
import StringRecommender from '../StringRecommender/StringRecommender';

export default function RacketSelector(props) {

    const [selectedRacket, setSelectedRacket] = React.useState(null);

    const recommendedRackets = props.rackets.map((racket, i) => {
        return (
            <div className="col-md-4">
                <RecommendedCard racket={racket} setSelected={setSelectedRacket} number={i+1}/>
            </div>
        )
    });

    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Recommended Rackets </h2>  
            <div className="container row">
                    {recommendedRackets}    
            </div>
            <StringRecommender selectedRacket={selectedRacket}/>
        </div>
    )
}

