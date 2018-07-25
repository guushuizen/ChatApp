import React, { Component } from 'react';

export default class ModalInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <p className="header">User: {this.props.userObject.username}</p>
                <p><b>Email: </b>{this.props.userObject.email}</p>
                <p><b>Phone Number: </b>{this.props.userInfo.phone_number}</p>
                <p className="subheader">Address</p>
                <p><b>Street address: </b>{this.props.userInfo.street_address}</p>
                <p><b>Postal code: </b>{this.props.userInfo.postal_code}</p>
                <p><b>City: </b>{this.props.userInfo.city}</p>


                { this.props.self &&
                <React.Fragment>
                    <hr />
                    <button className="btn btn-primary" onClick={this.props.edit}>Edit</button>
                </React.Fragment>
                }
            </React.Fragment>
        )
    }
}