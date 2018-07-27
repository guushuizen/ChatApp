import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Login from './auth/Login';
import Chatbox from './Chatbox';
import Register from "./auth/Register";
import UserModal from './user/UserModal';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            connection: new WebSocket("ws://" + window.location.hostname + ":8090"),
            messages: [],
            register: false,
            successfulRegistration: false,
            room: '',
            rooms: [],
            search: ''

        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.showRegisterForm = this.showRegisterForm.bind(this);
        this.handleSuccessfulRegistration = this.handleSuccessfulRegistration.bind(this);
        this.handleChannelSwitch = this.handleChannelSwitch.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.clearSearch = this.clearSearch.bind(this);

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
                'html': html,
                'time': data.message.created_at,
                'file': false
            };

            // this.state.messages.push(newMessage);

            let newMessages = this.state.messages;
            newMessages.unshift(newMessage);

            this.setState({
                messages: newMessages,
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'new_file') {
            console.log('new file: ', data);

            const html = `<p><b>${data.message.username === this.state.username ? 'You' : data.message.username}</b> uploaded a file.</p>
                          <p><a href="${data.message.file_url}" download>Click here to download</a></p>`;

            const newMessage = {
                'id': data.id,
                'username': data.message.username,
                'message': data.message.message,
                'self': (this.state.username === data.message.username),
                'html': html,
                'time': data.message.created_at,
                'file': true
            };

            let newMessages = this.state.messages;
            newMessages.unshift(newMessage);

            this.setState({
                messages: newMessages,
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'welcome') {
            let newMessages = [];
            let username = this.state.username;

            data.messages.map(function(message) {
                if (message.file_url) {
                    const html = `<p><b>${message.username === username ? 'You' : message.username}</b> uploaded a file.</p>
                                  <p><a href="${message.file_url}" download >Click here to download</a></p>`;

                    const newMessage = {
                        'id': message.id,
                        'username': message.username,
                        'message': message.message,
                        'self': (username === message.username),
                        'html': html,
                        'time': message.created_at,
                        'file': true
                    };

                    newMessages.push(newMessage);

                } else {
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
                        'html': html,
                        'file': false
                    };

                    newMessages.push(newMessage);
                }
            });

            this.setState({
                room: data.room,
                messages: newMessages,
                rooms: data.rooms
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'room-switch') {
            let newMessages = [];
            let username = this.state.username;

            data.messages.map(function(message) {
                if (message.file_url) {
                    const html = `<p><b>${message.username === username ? 'You' : message.username}</b> uploaded a file.</p>
                                  <p><a href="${message.file_url}" download >Click here to download</a></p>`;

                    const newMessage = {
                        'id': message.id,
                        'username': message.username,
                        'message': message.message,
                        'self': (username === message.username),
                        'html': html,
                        'time': message.created_at,
                        'file': true
                    };

                    newMessages.push(newMessage);

                } else {
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
                        'html': html,
                        'file': false
                    };

                    newMessages.push(newMessage);
                }
            });

            this.setState({
                room: data.room,
                messages: newMessages
            });

            document.querySelector('.box-container').scrollTop = document.querySelector('.box-container').scrollHeight;
        } else
        if (data.type === 'new_room') {
            let name = data.name;

            let currentRooms = this.state.rooms;
            currentRooms.push({
                name: name
            });

            this.setState({
                rooms: currentRooms
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

    handleUsername(username) {
        this.setState({
            search: username
        });
    }

    clearSearch() {
        this.setState({
            search: ''
        });
    }

    render() {
        return (
            <div className="page">
                <Header loggedIn={this.state.loggedIn} username={this.state.username} handleUsername={this.handleUsername} />

                { this.state.loggedIn ? <Chatbox username={this.state.username} showUser={this.handleUsername} rooms={this.state.rooms} changeChannel={this.handleChannelSwitch} currentChannel={this.state.room} submit={this.handleSubmit} messages={this.state.messages} /> : this.state.register ? <Register handleRegistration={this.handleSuccessfulRegistration}/> : <Login registration={this.state.successfulRegistration} login={this.handleLogin} register={this.showRegisterForm} />}
                
                <UserModal username={this.state.search} self={this.state.search === this.state.username} clear={this.clearSearch}/>
            </div>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));

    // scroll to bottom
}
