import React, { Component } from 'react';

export default class Login extends Component {

    constructor(props) {
        super(props);


        this.login = this.login.bind(this);
        // this.username = this.username.bind(this);
    }

    login(event) {
        let username = document.querySelector("input[name=username]").value;
        this.props.login(event, username);
    }

    render() {
        return (
            <div className="login-form">
                <div className="container">
                    <form className="form-group" onSubmit={this.login}>
                        <label htmlFor="username">Username:</label>
                        <input type="text" name="username" />

                        <input type="submit" className="form-submit" value="Log in"/>
                    </form>
                </div>
            </div>
        );
    }
}