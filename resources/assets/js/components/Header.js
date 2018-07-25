import React, { Component } from 'react';

export default class Header extends Component {

    constructor(props) {
        super(props);

        this.showModal = this.showModal.bind(this);
    }

    showModal() {
        this.props.handleUsername(this.props.username);
    }

    render() {
        return (
            <div className="page-header">
                <div className="container">
                    Chat App

                    { this.props.loggedIn ? <p className="user-welcome" onClick={this.showModal}>
                        Welcome, {this.props.username}
                    </p> : null }
                </div>
            </div>
        );
    }
}