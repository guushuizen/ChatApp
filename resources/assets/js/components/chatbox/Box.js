import React, { Component } from 'react';
import Message from './Message';
import Splitter from './Splitter';

export default class Box extends Component {

    constructor(props) {
        super(props)

    }

    getKey(i) {
        return "splitter-" + i;
    }

    render() {
        return (
            <div className="box-container">
                <div id="messages">
                    { this.props.messages.map(function (message, i, messages) {
                        return (
                            <React.Fragment key={message.id + '-div'}>
                                <Splitter messages={messages} currentIndex={i} key={message.id + "-splitter"}/>
                                <Message message={message} key={message.id} />
                            </React.Fragment>
                        );
                    }, this)}
                </div>
            </div>
        )
    }
}
