import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {

    constructor(props) {
        super(props);


        this.login = this.login.bind(this);
        // this.username = this.username.bind(this);
    }

    login(event) {
        let username = document.querySelector("input[name=username]").value;
        let password = document.querySelector("input[name=password]").value;
        let handleLogin = this.props.login;
        // this.props.login(event, username);
        event.preventDefault();

        axios.post('/api/login', {
            username,
            password
        }).then(function (response) {
            handleLogin(response.data.username, response.data.user_id);
        }).catch(function (error) {
            console.log(error);
        });

    }

    render() {
        return (
            <div className="login-form">
                <div className="container">

                    { this.props.registration && <div className="alert"><b>Great!</b> You have successfully registered and can now log in!</div> }

                    <form className="form-group" onSubmit={this.login}>
                        <div>
                            <label htmlFor="username">Username:</label>
                            <input type="text" name="username" />
                        </div>
                        <div>
                            <label htmlFor="Password">Password:</label>
                            <input type="password" name="password" />
                        </div>

                        <input type="submit" className="form-submit" value="Log in"/>
                    </form>

                    <hr className="divider" />

                    <p className="register-link">New? <a href="#" onClick={this.props.register}>Register now!</a></p>
                </div>
            </div>
        );
    }
}