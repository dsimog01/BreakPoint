import React, {useState} from 'react';
import Select from 'react-select';
import GetSelectValues from '../../logic/GetSelectValues';
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from '@mui/material';

export default function RacketRater() {

    const brandRef = React.useRef();
    const headSizeRef = React.useRef();
    const lengthRef = React.useRef();
    const weightRef = React.useRef();

    const [brands, setBrands] = React.useState([{label: "Loading...", value: "Loading..."}]);
    const [headSizes, setHeadSizes] = React.useState([{label: "Loading...", value: "Loading..."}]);
    const [lengths, setLengths] = React.useState([{label: "Loading...", value: "Loading..."}]);
    const [weights, setWeights] = React.useState([{label: "Loading...", value: "Loading..."}]);

    const [selectedBrand, setSelectedBrand] = React.useState("Babolat");
    const [selectedHeadSize, setSelectedHeadSize] = React.useState(0);
    const [selectedLength, setSelectedLength] = React.useState(0);
    const [selectedWeight, setSelectedWeight] = React.useState(0);
    const [rating, setRating] = React.useState(0);

    const [error, setError] = useState(false);
    const { isAuthenticated, user } = useAuth0();

    const {getRacketBrands, getHeadSizes, getRacketLengths, getRacketWeights, setRacketRating} = GetSelectValues(this);

    async function setBrandOptions(){

        if(brandRef.current !== undefined){
            let options = await getRacketBrands();            

            let brandsArray = JSON.parse(options.message);
            let newOptions = [];
            for(let brand of brandsArray){
                newOptions.push({label: brand, value: brand});
            }
            setBrands(newOptions);
        }

    }

    async function setHeadSizeOptions(){

        if(headSizeRef.current !== undefined){
            let options = await getHeadSizes(selectedBrand);            

            let sizesArray = JSON.parse(options.message);
            let newOptions = [];
            for(let size of sizesArray){
                newOptions.push({label: size, value: size});
            }
            setHeadSizes(newOptions);
        }
    }

    async function setLengthOptions(){
            
        if(lengthRef.current !== undefined){
            let options = await getRacketLengths(selectedBrand, selectedHeadSize);            

            let lengthsArray = JSON.parse(options.message);
            let newOptions = [];
            for(let length of lengthsArray){
                newOptions.push({label: length, value: length});
            }
            setLengths(newOptions);
        }
    }

    async function setWeightOptions(){
                
        if(weightRef.current !== undefined){
            let options = await getRacketWeights(selectedBrand, selectedHeadSize, selectedLength);            

            let weightsArray = JSON.parse(options.message);
            let newOptions = [];
            for(let weight of weightsArray){
                newOptions.push({label: weight, value: weight});
            }
            setWeights(newOptions);
        }
    }

    async function rateRacket(){

        if(isAuthenticated){

            setError(false);

            if(selectedBrand !== "" && selectedHeadSize !== "" && selectedLength !== "" && selectedWeight !== "" && rating !== 0){
                if(await setRacketRating(selectedBrand, selectedHeadSize, selectedLength, selectedWeight, rating, user.email.split("@")[0])){
                    alert("Racket rated successfully!");
                }
            }else{
                alert("Please fill in all fields!");
            }
        }else{
            setError(true);
        }
    }

    const handleBrandChange = (selectedOption) => {
        setSelectedBrand(selectedOption.value);
    }

    const handleHeadSizeChange = (selectedOption) => {
        setSelectedHeadSize(selectedOption.value);
    }

    const handleLengthChange = (selectedOption) => {
        setSelectedLength(selectedOption.value);
    }

    const handleWeightChange = (selectedOption) => {
        setSelectedWeight(selectedOption.value);
    }

    const handleRatingChange = (ratingValue) => {
        setRating(ratingValue.target.value);
    }


    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Do you want to rate other rackets?  </h2>  
            <div >
                <div id="selectors" className="row">
                    <div id="brandSelector" class="col-md-6">
                        <Select ref={brandRef} options={brands} onChange={handleBrandChange} defaultValue={{ label: "Brand", value: "brand" }} onFocus={setBrandOptions}/>

                    </div>
                    <div id="sizeSelector" class="col-md-6 mb-2">
                        <Select ref={headSizeRef} options={headSizes} onChange={handleHeadSizeChange} defaultValue={{ label: "Head Size (in2)", value: "headSize_in2" }} onFocus={setHeadSizeOptions}/>
                    </div>
                    <div id="lengthSelector" class="col-md-6">
                        <Select ref={lengthRef} options={lengths} onChange={handleLengthChange} defaultValue={{ label: "Length (in)", value: "length" }} onFocus={setLengthOptions}/>
                    </div>
                    <div id="weightSelector" class="col-md-6 mb-2">
                        <Select ref={weightRef} options={weights} onChange={handleWeightChange} defaultValue={{ label: "Weight (g)", value: "weight" }} onFocus={setWeightOptions}/>
                    </div>

                </div>

                <center><div id="rating" className="mb-2 w-25">
                        <input type="text" class="form-control" placeholder="Rating" onChange={handleRatingChange}/>
                </div></center>

                <button className="btn btn-dark mb-2" onClick={rateRacket}>Rate it!</button>
                {error ? <Alert severity="error">You must log in!</Alert>: null}

            </div>
        </div>
    )
}
