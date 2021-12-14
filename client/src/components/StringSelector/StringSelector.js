import React, {useState} from 'react';
import Card from '../Card/StringCard';
import strings from '../../data/stringsSpecs.json';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from '@mui/material';


export default function StringSelector() {

  let ratingValues = {
    2: 0,
    4: 0,
    6: 0,
    10: 0,
    17: 0
};

  const [ratings, setRatingValues] = useState(ratingValues);

    const storedStrings = strings.stringsSpecs.map((stringItem, i) => {
        return (
          <div className="col-md-4">
            <Card string={stringItem} ratings={ratings} updateRatings={setRatingValues}/>
          </div>
        )
      });

      const { isAuthenticated, user } = useAuth0();

      const [error, setError] = useState(false);
  
      const rateStrings = () => {
  
          if(isAuthenticated){
              setError(false);
  
              let requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(ratings)
              };
              fetch('http://localhost:3001/postStringRatings?username='+user.email, requestOptions)
              .then(response => response.json())
              .then(data => data);
          }else{
              setError(true);
          }
  
      };

    return(
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Could you rate the following strings?  </h2>  
            <div className="container row mb-3">
                {storedStrings}
            </div>
            <button className="btn btn-dark mb-2" onClick={rateStrings}>Rate it</button>
            {error ? <Alert severity="error">You must log in!</Alert>: null}
        </div>
    );
}
