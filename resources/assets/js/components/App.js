import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Login from './auth/Login';
import Chatbox from './Chatbox';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            connection: new WebSocket("ws://127.0.0.1:8090"),
            messages: []
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);

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
                messages: newMessages
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        }
        // console.log(this.state.messages);
    }

    handleLogin(event, username) {
        event.preventDefault();

        if (this.state.connection.readyState === WebSocket.OPEN) {
            this.state.connection.send(username);
            this.setState({
                loggedIn: true,
                username
            });
        } else {
            alert('The server is currently not available, please try again later.')
        }
    }

    handleSubmit(event, message) {
        event.preventDefault();
        document.querySelector("textarea[name=message]").value = "";
        this.state.connection.send(message);
    }

    render() {
        return (
            <div className="page">
                <Header loggedIn={this.state.loggedIn} username={this.state.username}></Header>

                { !this.state.loggedIn && <Login login={this.handleLogin} username={this.state.username}></Login>}

                { this.state.loggedIn && <Chatbox submit={this.handleSubmit} messages={this.state.messages}></Chatbox>}
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));

    // scroll to bottom
}
