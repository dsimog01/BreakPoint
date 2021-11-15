import React, { Component } from 'react';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render(){

        return(
            <div className="container mt-5 p-4 border rounded-3">
                <p>User:  Password: </p>
            </div>
        );
    }
}

export default Login;