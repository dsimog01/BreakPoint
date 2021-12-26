import React from 'react';
import { Alert } from '@mui/material';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import babolat from '../../media/rackets/babolat.jpg';
import wilson from '../../media/rackets/wilson.jpg';
import tecnifibre from '../../media/rackets/tecnifibre.jpg';
import head from '../../media/rackets/head.jpg';
import yonex from '../../media/rackets/yonex.jpg';
import dunlop from '../../media/rackets/dunlop.jpg';
import pro from '../../media/rackets/pro.jpg';

export default function RecommendationButton(props) {

    const [error, setError] = useState(false);

    const { isAuthenticated, user } = useAuth0();

    let imageDictionary = {
        "Babolat": babolat,
        "Wilson": wilson,
        "Tecnifibre": tecnifibre,
        "Head": head,
        "Yonex": yonex,
        "Dunlop": dunlop,
        "Pro": pro
    };

    async function getCollaborativeRecommendation(){
            
        if(isAuthenticated){
            setError(false);

            let requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            
            let response = await fetch('http://localhost:3001/getCollaborativeRecommendation?username='+user.email.split("@")[0], requestOptions)
            
            getRacketsData(await response.json());

        }else{
            setError(true);
        }
    }

    async function getContentRecommendation(){
            
        if(isAuthenticated){
            setError(false);

            let requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            
            let response = await fetch('http://localhost:3001/getContentRecommendation?username='+user.email.split("@")[0], requestOptions)
            
            getRacketsData(await response.json());

        }else{
            setError(true);
        }
    }

    async function getRacketsData(recommendedModelIDs){
  
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recommendedModelIDs)
        };
        
        let response = await fetch('http://localhost:3001/getRacketsDetails', requestOptions)
        let racketsArray = await response.json();

        let racketsData = [];

        racketsArray.forEach(racket => {
            let racketData = {
                modelID: racket._fields[0],
                brand: racket._fields[1],
                price: racket._fields[2],
                headSize: racket._fields[3],
                length: racket._fields[4],
                stringPattern: racket._fields[5],
                weight: racket._fields[6],
                image: imageDictionary[racket._fields[1]]
            };
            racketsData.push(racketData);
        });

        props.setRecommendedModels(racketsData);
  };

    return (
    <div className="container mt-5 p-4 border rounded-3">
        <h2> Get your recommendation!  </h2>  
        <div className='mt-2'>
            <div id="buttons" className="d-flex justify-content-center">
                <button className="btn btn-lg btn-dark mx-2 col-md-5" onClick={getCollaborativeRecommendation}>Collaborative</button>
                <button className="btn btn-lg btn-dark mx-2 col-md-5" onClick={getContentRecommendation} >Content</button>
            </div>
        </div>
        {error ? <Alert severity="error" className="mt-4">You must log in!</Alert>: null}
    </div>
    )
}