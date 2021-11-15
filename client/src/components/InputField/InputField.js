import React, { Component } from 'react';

class TodoField extends Component {
    render() {

        return(
            <div className="form-group mb-2">
                <input type="text" name={ this.props.fieldName } onChange={ this.props.fieldOnChange } className="form-control" placeholder={ this.props.fieldPlaceHolder } />
            </div>
        );
    }
}

export default TodoField;