import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';

export default class Message extends Component {

    constructor(props) {
        super(props);

        this.getTime = this.getTime.bind(this);
        this.showUserModal = this.showUserModal.bind(this);
    }

    getTime(timestamp) {
        let date = moment(timestamp);
        let minutes = (date.minute() < 10 ? '0' : '') + date.minute();
        let hours = (date.hour() < 10 ? '0' : '') + date.hour();

        return hours + ":" + minutes;
    }

    showUserModal() {
        this.props.showUser(this.props.message.username);
        console.log('from message.js');
    }

    render() {
        const self = this.props.message.self;
        const file = this.props.message.file;
        const className = `message-wrapper ${self ? 'self' : ''} ${file ? 'file' : ''}`

        return (
            <div className={className}>
                <div className="message" onClick={this.showUserModal}>
                    {renderHTML(this.props.message.html)}
                </div>
                <p className="time">{this.getTime(this.props.message.time)}</p>
            </div>
        );
    }

    componentDidMount() {
        document.querySelectorAll('.message-wrapper a').forEach(function(element) {
            element.addEventListener('click', function(event) {
                event.stopPropagation();
            })
        })
    }
}