import React, { Component } from 'react';
import Message from './Message';
import Splitter from './Splitter';
// import moment from 'moment';

export default class Box extends Component {

    constructor(props) {
        super(props)

    }

    getKey(i) {
        return "splitter-" + i;
    }

    render() {
        console.log(this.props.messages[1]);
        return (
            <div className="box-container">
                <div id="messages">
                    { this.props.messages.map(function (message, i, messages) {
                        console.log(`Message #${i}: ${message.message}`);
                        return (
                            <div key={message.id + '-div'}>
                                <Splitter messages={messages} currentIndex={i} key={message.id + "-splitter"}/>
                                <Message message={message} key={message.id} />
                            </div>
                        );
                    }, this)}
                </div>
            </div>
        )
    }
}
