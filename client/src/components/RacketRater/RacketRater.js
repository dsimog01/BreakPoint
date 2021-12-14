import React from 'react';
import Select from 'react-select';
import GetSelectValues from '../../logic/GetSelectValues';

export default function RacketRater() {

    function getBrands(){
        return GetSelectValues().getRacketBrands();
    }

    return (
        <div className="container mt-5 p-4 border rounded-3">
            <h2> Do you want to rate other rackets?  </h2>  
            <div >
                <div id="selectors" className="row">
                    <div id="brandSelector" class="col-md-6">
                        <Select defaultValue={{ label: "Brand", value: "brand" }}/>
                        <p>{!getBrands ? "Loading..." : getBrands}</p>

                    </div>
                    <div id="sizeSelector" class="col-md-6 mb-2">
                        <Select defaultValue={{ label: "Head Size (in2)", value: "headSize_in2" }}/>
                    </div>
                    <div id="lengthSelector" class="col-md-6">
                        <Select defaultValue={{ label: "Length (in)", value: "length" }}/>
                    </div>
                    <div id="weightSelector" class="col-md-6 mb-2">
                        <Select defaultValue={{ label: "Weight (g)", value: "weight" }}/>
                    </div>

                </div>

                <center><div id="rating" className="mb-2 w-25">
                        <input type="text" class="form-control" placeholder="Rating"/>
                </div></center>

                <button className="btn btn-dark">Rate it</button>
            </div>
        </div>
    )
}
