import React from 'react';

export default function StringRecommender(props) {

    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2 className='mb-2'> Get the string that best suits your racket and your game! </h2>  
            <div className="container mt-5 d-flex justify-content-center">
                <div className='mx-2 col-md-5'>
                    <h4> 1. Select one of the recommended rackets above </h4>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <h5 className='card-title'>Selected racket</h5>
                            <h5>{props.selectedRacket}</h5>
                        </div>
                    </div>
                </div>

                <div className='mx-2 col-md-5'>
                    <h4> 2. Select the player whose game is most similar to yours</h4>
                </div>
            </div>
        </div>
    )
}

