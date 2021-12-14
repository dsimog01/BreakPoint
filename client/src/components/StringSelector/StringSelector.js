import React from 'react';
import Card from '../Card/StringCard';
import strings from '../../data/stringsSpecs.json';


export default function StringSelector() {
    const storedStrings = strings.stringsSpecs.map((stringItem, i) => {
        return (
          <div className="col-md-4">
            <Card string={stringItem}/>
          </div>
        )
      });

    return(
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Could you rate the following strings?  </h2>  
            <div className="container row">
                {storedStrings}
            </div>
        </div>
    );
}
