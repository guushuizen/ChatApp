import React, { Component } from 'react';

export default class Channels extends Component {

    constructor(props) {
        super(props);

        this.changeChannel = this.changeChannel.bind(this);
    }

    changeChannel(event) {
        event.preventDefault();
        let channelname = document.querySelector('input[type=submit]').value;
        this.props.channelSwitch(channelname);
    }

    capitalise(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    cancelOnSubmit(event) {
        event.preventDefault();
        document.querySelector('input[name=channelname]').value = '';
    }

    render() {
        return (
            <div className="channels">
                <h1 className="header">Channels</h1>

                <p className="current">Current channel: {this.capitalise(this.props.currentChannel)}</p>

                <form action="#" onSubmit={this.changeChannel}>
                    <input type="text" name="channelname" />
                    <input type="submit" className="form-submit" value="Connect" />
                </form>
            </div>
        );
    }
}