import React, { Component } from 'react';

export default class Header extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-header">
                <div className="container">
                    Chat App

                    { this.props.loggedIn ? <p className="user-welcome">
                        Welcome, {this.props.username}
                    </p> : null }
                </div>
            </div>
        );
    }
}