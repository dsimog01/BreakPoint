import React from 'react';
import GetSelectValues from '../../logic/GetSelectValues';
import Select from 'react-select';

export default function StringRecommender(props) {

    const topPlayerRef = React.useRef();

    const {getTopPlayers} = GetSelectValues();

    const [topPlayers, setTopPlayers] = React.useState([{label: "Loading...", value: "Loading..."}]);

    async function setTopPlayerOptions(){
        if(topPlayerRef.current !== undefined){
            let players = await getTopPlayers();
            let newPlayers = [];
            for(let player of players){
                newPlayers.push({label: player, value: player});
            }
            setTopPlayers(newPlayers);
        }
    }


    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2 className='mb-2'> Get the string that best suits your racket and your game! </h2>  
            <div className="container mt-5 d-flex justify-content-center">
                <div className='mx-2 col-md-5'>
                    <h4> 1. Select one of the recommended rackets above </h4>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <Select defaultValue={{ label: "Selected Racket", value: "Selected Racket" }} options={[{label:"1",value:"1"}, {label:"2",value:"2"}, {label:"3",value:"3"}]}/>
                        </div>
                    </div>
                </div>

                <div className='mx-2 col-md-5'>
                    <h4> 2. Select the player whose game is most similar to yours</h4>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <Select ref={topPlayerRef} defaultValue={{ label: "Top Players", value: "Top Players" }} options={topPlayers} onFocus={setTopPlayerOptions}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

