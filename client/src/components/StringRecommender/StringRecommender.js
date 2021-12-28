import React from 'react';
import GetSelectValues from '../../logic/GetSelectValues';
import Select from 'react-select';
import { TextField } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

export default function StringRecommender(props) {

    const selectedRacketRef = React.useRef(null);
    const topPlayerRef = React.useRef();

    let userHeight, userWeight;

    const {getTopPlayers} = GetSelectValues();

    const { user } = useAuth0();

    const [topPlayers, setTopPlayers] = React.useState([{label: "Loading...", value: "Loading..."}]);

    const handleWeightChange = (event) => {
        userWeight = event.target.value;
    }

    const handleHeightChange = (event) => {
        userHeight = event.target.value;
    }

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

    async function getRecommendedStrings(){
        let requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        let selectedPlayer = topPlayerRef.current.getValue()[0].value;
        let selectedRacket = selectedRacketRef.current.getValue()[0].value;
        let selectedRacketID = props.selectedRacketModels[selectedRacket-1].modelID;
        
        let response = await fetch('http://localhost:3001/getStringRecommendation?username='+user.email.split("@")[0] + '&selectedPlayer=' + selectedPlayer + '&userHeight=' + userHeight + '&userWeight=' + userWeight + '&selectedRacketID=' + selectedRacketID, requestOptions)
        
        getStringsData(await response.json());
    }

    async function getStringsData(recommendedModelIDs){
  
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recommendedModelIDs)
        };
        
        let response = await fetch('http://localhost:3001/getStringsDetails', requestOptions)
        let stringsArray = await response.json();

        let stringsData = [];

        stringsArray.forEach(string => {
            let stringData = {
                modelID: string._fields[0],
                brand: string._fields[1],
                type: string._fields[2],
                composition: string._fields[3],
                gauge: string._fields[4],
            };
            stringsData.push(stringData);
        });

        props.setRecommendedStrings(stringsData);
    };


    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2 className='mb-2'> Get the string that best suits your racket and your game! </h2>  
            <div className="container mt-5 d-flex justify-content-center">
                <div className='mx-2 col-md-5'>
                    <h5> 1. Select one of the recommended rackets above </h5>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <Select ref={selectedRacketRef} defaultValue={{ label: "Selected Racket", value: "Selected Racket" }} options={[{label:"1",value:"1"}, {label:"2",value:"2"}, {label:"3",value:"3"}]}/>
                        </div>
                    </div>
                </div>

                <div className='mx-2 col-md-5'>
                    <h5> 2. Select the player whose game is most similar to yours</h5>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <Select ref={topPlayerRef} defaultValue={{ label: "Top Players", value: "Top Players" }} options={topPlayers} onFocus={setTopPlayerOptions}/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5 d-flex justify-content-center">
                <div className='mx-2 col-md-5'>
                    <h5> 3. Introduce your weight</h5>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <TextField label="Weight (kg)" onChange={handleWeightChange}/>
                        </div>
                    </div>
                </div>

                <div className='mx-2 col-md-5'>
                    <h5> 4. Introduce your height</h5>
                    <div className='card mt-2 mb-2'>
                        <div className='card-body'>
                            <TextField label="Height (m)" onChange={handleHeightChange}/>
                        </div>
                    </div>
                </div>
            </div>
            <button className='btn btn-dark mt-4' onClick={getRecommendedStrings}> Get the recommended strings! </button>
        </div>
    )
}

