import React from 'react';

import RecommendedCard from '../Card/RecommendedCard';
import StringRecommender from '../StringRecommender/StringRecommender';
import RecommendedStrings from '../RecommendedModels/RecommendedStrings'

export default function RecommendedModels(props) {

    const [recommendedStrings,setRecommendedStrings] = React.useState([]);

    const recommendedRackets = props.rackets.map((racket, i) => {
        return (
            <div className="col-md-4">
                <RecommendedCard racket={racket} number={i+1}/>
            </div>
        )
    });

    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Recommended Rackets </h2>  
            <div className="container row">
                    {recommendedRackets}    
            </div>
                <StringRecommender selectedRacketModels={props.rackets} setRecommendedStrings={setRecommendedStrings}/>
                {recommendedStrings.length!==0 ? <RecommendedStrings strings={recommendedStrings}/>: null}
            </div>
    )
}

