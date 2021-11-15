import React, { Component } from 'react';
import InputField from '../InputField/InputField';

class TodoForm extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            responsible: '',
            description: '',
            priority: 'low'
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
            <div className="card mt-3">
                <form className="card-body" onSubmit={this.handleSubmit}>
                    <InputField fieldName="title" fieldPlaceHolder="Title" fieldOnChange={this.handleInput} />
                    <InputField fieldName="responsible" fieldPlaceHolder="Responsible" fieldOnChange={this.handleInput} />
                    <InputField fieldName="description" fieldPlaceHolder="Description" fieldOnChange={this.handleInput} />
                    
                    <div className="form-group mb-2">
                        <select name="priority" onChange={this.handleInput} className="form-control">
                            <option>low</option>
                            <option>medium</option>
                            <option>high</option>
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

export default TodoForm;