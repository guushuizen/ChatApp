import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Login from './auth/Login';
import Chatbox from './Chatbox';
import Register from "./auth/Register";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            connection: new WebSocket("ws://" + window.location.hostname + ":8090"),
            messages: [],
            register: false,
            successfulRegistration: false,
            room: ''
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);
        this.handleSuccessfulRegistration = this.handleSuccessfulRegistration.bind(this);
        this.handleChannelSwitch = this.handleChannelSwitch.bind(this);

        this.state.connection.onmessage = this.handleNewMessage;
    }

    handleNewMessage(event) {
        let data = JSON.parse(event.data);
        if (data.type === 'new_message') {
            let message = data.message;
            let html = '';

            if (data.username === this.state.username) {
                html = `<span class='username'>You:</span> ${message}`
            } else {
                html = `<span class='username'>${data.username}:</span> ${data.message}`
            }

            let newMessage = {
                'id': data.id,
                'username': data.username,
                'message': data.message,
                'self': (this.state.username === data.username),
                'html': html
            };

            // this.state.messages.push(newMessage);

            let newMessages = this.state.messages;
            newMessages.unshift(newMessage);

            this.setState({
                'messages': newMessages
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'welcome') {
            let newMessages = [];
            let username = this.state.username;
            console.log(data);

            data.messages.map(function(message) {
                let html = '';

                if (message.username === username) {
                    html = `<span class='username'>You:</span> ${message.message}`
                } else {
                    html = `<span class='username'>${message.username}:</span> ${message.message}`
                }

                let newMessage = {
                    'id': message.id,
                    'username': message.username,
                    'message': message.message,
                    'self': (message.username === username),
                    'time': message.created_at,
                    'html': html
                };

                newMessages.push(newMessage);
            });

            this.setState({
                room: data.room,
                messages: newMessages
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'room-switch') {
            let newMessages = [];
            let username = this.state.username;
            console.log(data);

            data.messages.map(function(message) {
                let html = '';

                if (message.username === username) {
                    html = `<span class='username'>You:</span> ${message.message}`
                } else {
                    html = `<span class='username'>${message.username}:</span> ${message.message}`
                }

                let newMessage = {
                    'id': message.id,
                    'username': message.username,
                    'message': message.message,
                    'self': (message.username === username),
                    'time': message.created_at,
                    'html': html
                };

                newMessages.push(newMessage);
            });

            this.setState({
                room: data.room,
                messages: newMessages
            });
        }
    }

    handleLogin(username, user_id) {
        this.state.connection.send(JSON.stringify({
            type: 'identification',
            username: username,
            user_id: user_id
        }));

        console.log(JSON.stringify({
            type: 'identification',
            username: username,
            user_id: user_id
        }));

        this.setState({
            username,
            user_id,
            loggedIn: true
        })
    }

    handleSubmit(event, message) {
        event.preventDefault();
        document.querySelector("textarea[name=message]").value = "";

        message.username = this.state.username;
        message.user_id = this.state.user_id;
        message.room = this.state.room;

        this.state.connection.send(JSON.stringify(message));
    }

    showRegisterForm() {
        this.setState({
            register: true,

        })
    }

    handleSuccessfulRegistration() {
        this.setState({
            register: false,
            successfulRegistration: true
        })
    }

    handleChannelSwitch(newRoom) {
        this.state.connection.send(JSON.stringify({
            type: 'room-switch',
            username: this.state.username,
            room: newRoom
        }));

        this.setState({
            messages: []
        });
    }

    render() {
        return (
            <div className="page">
                <Header loggedIn={this.state.loggedIn} username={this.state.username} />

                { this.state.loggedIn ? <Chatbox changeChannel={this.handleChannelSwitch} currentChannel={this.state.room} submit={this.handleSubmit} messages={this.state.messages} /> : this.state.register ? <Register handleRegistration={this.handleSuccessfulRegistration}/> : <Login registration={this.state.successfulRegistration} login={this.handleLogin} register={this.showRegisterForm} />}
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));

    // scroll to bottom
}
