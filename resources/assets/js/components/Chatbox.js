import React, { Component } from 'react';
import Box from './chatbox/Box';
import Form from './chatbox/Form';
import Channels from './chatbox/Channels';

export default class Chatbox extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="chat-container">
                <div className="chatbox">
                    <h1 className="form-header">Message Centre</h1>
                    <Box messages={this.props.messages} showUser={this.props.showUser} />
                    <Form submit={this.props.submit} username={this.props.username} />
                </div>

                <Channels channelSwitch={this.props.changeChannel} currentChannel={this.props.currentChannel} rooms={this.props.rooms} />
            </div>
        )
    }
}