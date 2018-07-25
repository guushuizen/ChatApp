import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import ModalInfo from './ModalInfo';
import ModalEdit from "./ModalEdit";

export default class UserModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            userObject: {},
            userInfo: {},
            edit: false,
        };

        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    onOpenModal() {
        this.setState({ open: true });
    };

    onCloseModal() {
        this.setState({ open: false });
        this.props.clear();
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
                    userObject: data.user,
                    userInfo: data.userInfo
                });
                this.onOpenModal();
            });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.username) {
            this.setState({
                self: nextProps.self
            });
            this.fetchUser(nextProps.username);
        }
    }

    updateUser(user) {
        fetch(`/api/user/${user.username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then((response) => {
            response.json().then((data) => {
                console.log(data);
                 if (data.status === 200) {
                     this.onCloseModal();
                     this.setState({
                         edit: false,
                         open: false,
                         userObject: {},
                         userInfo: {},
                     });
                 }
            });
        })
    }

    render() {
        let { open } = this.state;
        return (
            <Modal open={open} onClose={this.onCloseModal} center>
                <div className="modal">
                    {this.state.edit
                        ? <ModalEdit userInfo={this.state.userInfo} userObject={this.state.userObject}
                               edit={this.updateUser} />
                        : <ModalInfo userInfo={this.state.userInfo} userObject={this.state.userObject}
                               self={this.state.self} edit={() => { this.setState({edit: true}); } } />
                    }
                </div>
            </Modal>
        );
    }
}