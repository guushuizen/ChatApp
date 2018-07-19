import React, { Component } from 'react';
import moment from 'moment';

export default class Splitter extends Component {

    constructor(props) {
        super(props);
    }

    difference(currentMessage, previousMessage) {
        if (moment(currentMessage.time).dayOfYear() > moment(previousMessage.time).dayOfYear()) {
            return moment(currentMessage.time).dayOfYear() - moment(previousMessage.time).dayOfYear()
        } else if (moment(currentMessage.time).dayOfYear() === moment(previousMessage.time).dayOfYear()) {
            return 0;
        }
    }

    format(nextTime) {
        if (moment(nextTime.time).dayOfYear() === moment().dayOfYear()) {
            return 'Today';
        } else if (moment(nextTime.time).dayOfYear() + 1 === moment().dayOfYear()) {
            return 'Yesterday'
        } else {
            let date = moment(nextTime.time);
            return date.format('DD/MM/YYYY');
        }
    }

    render() {
        if (this.props.messages[this.props.currentIndex + 1]) {
            let difference = this.difference(this.props.messages[this.props.currentIndex], this.props.messages[this.props.currentIndex + 1]);
            if (difference > 0) {
                var name = this.format(this.props.messages[this.props.currentIndex]);
                return (
                    <p className="splitter">{name}</p>
                )
            } else {
                return null;
            }
        } else
        if (this.props.currentIndex === (this.props.messages.length - 1)) {
            let name = this.format(this.props.messages[this.props.currentIndex]);
            return (
                <p className="splitter">{name}</p>
            );
        } else {
            return null;
        }
    }
}