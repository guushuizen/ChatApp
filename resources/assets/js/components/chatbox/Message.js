import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';

export default class Message extends Component {

    constructor(props) {
        super(props);

        this.getTime = this.getTime.bind(this);
    }

    getTime(timestamp) {
        let date = moment(timestamp);
        let minutes = (date.minute() < 10 ? '0' : '') + date.minute();
        let hours = (date.hour() < 10 ? '0' : '') + date.hour();

        return hours + ":" + minutes;
    }

    render() {
        return (
            <div className={this.props.message.self ? "message-wrapper self" : "message-wrapper"}>
                <div className="message">
                    {renderHTML(this.props.message.html)}
                </div>
                <p className="time">{this.getTime(this.props.message.time)}</p>
            </div>
        );
    }
}