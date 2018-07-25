import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

export default class UserModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            userObject: {}
        };

        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
    }

    onOpenModal() {
        this.setState({ open: true });
    };

    onCloseModal() {
        this.setState({ open: false });
    };

    fetchUser(username) {
        fetch(`/api/user`, {
            method: 'post',
            body: JSON.stringify({
                username: username
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            response.json().then((data) => {
                this.setState({
                    userObject: data.user
                });
                this.onOpenModal();
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.username) {
            this.fetchUser(nextProps.username);
        }
    }

    render() {
        let { open } = this.state;
        return (
            <Modal open={open} onClose={this.onCloseModal} center>
                <p><b>Username: </b>{this.state.userObject.username}</p>
                <p><b>Email: </b>{this.state.userObject.email}</p>
            </Modal>
        );
    }
}