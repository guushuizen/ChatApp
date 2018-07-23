import React, { Component } from 'react';
import FormInput from './FormInput';
import axios from 'axios';

export default class Register extends Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        let username = document.querySelector('input[name=username]').value;
        let email = document.querySelector('input[name=email').value;
        let password = document.querySelector('input[name=password').value;

        let handleSuccess = this.props.handleRegistration;

        axios.post('/api/register', {
                username,
                email,
                password
            }).then(function(response) {
                handleSuccess();
            }).catch(function(error) {
                console.log(error);
        });
    }


    render() {
        return (
            <div className="register-form">
                <div className="container">
                    <h1 className="header">Register</h1>

                    <form action="#" onSubmit={this.handleSubmit} className="form-wrapper">
                        <FormInput name="Username"/>
                        <FormInput name="Email"/>
                        <FormInput name="Password"/>

                        <input type="submit" className="form-submit" value="Register" />
                    </form>
                </div>
            </div>
        )
    }
}