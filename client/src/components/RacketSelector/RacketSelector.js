import React, { useState } from 'react';
import Card from '../Card/Card';
import rackets from '../../data/racketsSpecs.json';
import RacketRater from "../../components/RacketRater/RacketRater";
import { Alert } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export default function RacketSelector(props) {

    let ratingValues = {
        10: 0,
        3: 0,
        151 : 0,
        41: 0,
        23: 0,
        113: 0,
        45: 0
    };

    const [ratings, setRatingValues] = useState(ratingValues);

    const storedRackets = rackets.racketsSpecs.map((racketItem, i) => {
        return (
          <div className="col-md-4">
            <Card racket={racketItem} ratings={ratings} updateRatings={setRatingValues}/>
          </div>
        )
    });

    const { isAuthenticated, user } = useAuth0();

    const [error, setError] = useState(false);

    const rateRackets = () => {

        if(isAuthenticated){
            setError(false);

            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ratings)
            };
            fetch('http://localhost:3001/postRacketRatings?username='+user.email, requestOptions)
            .then(response => response.json())
            .then(data => data);
        }else{
            setError(true);
        }

    };


    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Could you rate the following rackets?  </h2>  
            <div className="container row">
                {storedRackets}
            </div>
            <button className="btn btn-dark mb-2" onClick={rateRackets}>Rate them!</button>
            {error ? <Alert severity="error" className="mt-2">You must log in!</Alert>: null}
            <RacketRater/>
        </div>
    )
}

