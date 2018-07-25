import React, { Component } from 'react';

export default class ModalEdit extends Component {
    constructor(props) {
        super(props);

        let user = {};
        Object.keys(props.userInfo).forEach((element) => {
            user[element] = props.userInfo[element];
        });
        Object.keys(props.userObject).forEach((element) => {
            user[element] = props.userObject[element];
        });

        this.state = {
            user: user
        };

        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
    }

    update (event) {
        event.preventDefault();
        this.props.edit(this.state.user);
    }

    handleChange(event) {
        console.log(event.target);
        let user = this.state.user;
        user[event.target.name] = event.target.value;

        this.setState({
            user: user
        });
    }

    render() {
        return (
            <React.Fragment>
                <form action="#" onSubmit={this.update}>
                    <p className="header">User: {this.state.user.username}</p>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" value={this.state.user.email}  onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone-number">Phone number:</label>
                        <input type="text" name="phone_number" value={this.state.user.phone_number}  onChange={this.handleChange} />
                    </div>

                    <p className="subheader">Address</p>

                    <div className="form-group">
                        <label htmlFor="street-address">Street address:</label>
                        <input type="text" name="street_address" value={this.state.user.street_address}  onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="postal-code">Postal code:</label>
                        <input type="text" name="postal_code" value={this.state.user.postal_code}  onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input type="text" name="city" value={this.state.user.city}  onChange={this.handleChange} />
                    </div>

                    <input type="submit" className="form-submit" value="Submit" />
                </form>
            </React.Fragment>
        )
    }
}