import React, { Component } from 'react';
import Select from 'react-select';
import GetSelectValues from '../../logic/GetSelectValues';

class RacketRater extends Component {


    render(){

        //const {getHeadSizes, getRacketBrands} = GetSelectValues(this);

        let racketBrands = GetSelectValues(this).getRacketBrands();

        console.log(racketBrands);

        return(
            <div className="container mt-5 p-4 border rounded-3">
                <h2> Do you want to rate other rackets?  </h2>  
                <div className="container">
                    <Select/>
                    <button className="btn btn-primary">Rate it</button>
                </div>
            </div>
        );
    }
}

export default RacketRater;