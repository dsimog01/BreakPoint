import React, { Component } from 'react';
import InputField from '../InputField/InputField';
import './RacketInput.css';

class RacketInput extends Component {
    constructor() {
        super();
        this.state = {
            brand: '',
            price: 0,
            headSize: 0,
            length: 0,
            weight: 0,
            minTension: 0,
            maxTension: 0,
            beamWidth: 0,
            flex: 0,
            powerLevel: 'Low',
            stringPattern: '16x19'
        };
        this.handleInput = this.handleInput.bind(this); //Necesario para usar la manejadora
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Requerimos esta manejadora para evitar que se refresque la pagina en cada submit
    handleSubmit(event) {
        event.preventDefault();
        this.props.onAddTodo(this.state);
    }

    handleInput(event) {
        //console.log(event.target.value, event.target.name);//Valor y nombre del elemento que ha sido alterado
        //this.state.title = ... ESTO NO ES POSIBLE

        const { value, name } = event.target;

        this.setState(
            {
                [name]: value
            }
        );

        //Una vez tenemos el estado del componente almacenado, vamos a enviarlo
    }

    render() {
        return(
            <div className="card mt-3" id="card-body">
                <h2 className="mt-3"> What are the features of your favourite racket?  </h2>  
                <form className="card-body" onSubmit={this.handleSubmit}>

                    <div className="first-line">
                        <input type="text" name="brand" onChange={this.handleInput} className="form-control" placeholder="Brand" />
                        <input type="text" name="price" onChange={this.handleInput} className="form-control" placeholder="Price" />
                    </div>

                    <div className="second-line">
                        <input type="text" name="headSize" onChange={this.handleInput} className="form-control" placeholder="Head Size" />
                        <input type="text" name="length" onChange={this.handleInput} className="form-control" placeholder="Length" />
                        <input type="text" name="weight" onChange={this.handleInput} className="form-control" placeholder="Weight" />
                        <input type="text" name="beamWidth" onChange={this.handleInput} className="form-control" placeholder="Beam Width" />
                    </div>

                    <div className="third-line">
                        <input type="text" name="minTension" onChange={this.handleInput} className="form-control" placeholder="Minimum Tension" />
                        <input type="text" name="maxTension" onChange={this.handleInput} className="form-control" placeholder="Maximum Tension" />
                        <input type="text" name="flex" onChange={this.handleInput} className="form-control" placeholder="Flex" />
                    </div>

                                        
                    <div className="form-group mb-2">
                        <select name="powerLevel" onChange={this.handleInput} className="form-control">
                            <option>Power Level</option>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success">
                        Save
                    </button>
                </form>
            </div>
        );
    }
}

export default RacketInput;