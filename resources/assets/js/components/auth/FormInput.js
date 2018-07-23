import React, { Component } from 'react';

export default class FormInput extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let className = "form-group " + this.props.name.toLowerCase();
        return (
            <div className={className}>
                <label htmlFor={this.props.name.toLowerCase()}>{this.props.name}:</label>
                <input type={ this.props.name === 'Email' ? 'email' : (this.props.name === 'Password' ? 'password' : 'text' )}
                       name={this.props.name.toLowerCase()} className="form-control" />
            </div>
        );
    }

}