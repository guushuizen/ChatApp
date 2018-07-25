import React, { Component } from 'react';

export default class Channels extends Component {

    constructor(props) {
        super(props);

        this.changeChannel = this.changeChannel.bind(this);
        this.changeRoom = this.changeRoom.bind(this);
    }

    changeChannel(event) {
        event.preventDefault();
        let channelname = document.querySelector('input[name=channelname]').value;
        this.changeRoom(channelname);
    }

    changeRoom(name) {
        document.querySelector('input[name=channelname]').value = '';
        this.props.channelSwitch(name);
    }

    capitalise(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    componentDidUpdate() {
        // for (var i = 0; i < document.getElementsByClassName("channel").length; i++) {
        //     let el = document.getElementsByClassName("channel")[i];
        //     let changeRoom = this.changeRoom;
        //     el.addEventListener('click', function(event) {
        //         let channel = event.target.innerHTML;
        //         changeRoom(channel);
        //     })
        // }
    }

    render() {
        let { changeRoom } = this;
        return (
            <div className="channels">
                <h1 className="header">Channels</h1>

                <p className="current">Current channel: {this.capitalise(this.props.currentChannel)}</p>

                <p className="ul-header">Available channels:</p>
                <ul>
                    {this.props.rooms.map(function(room, i) {
                        return (
                            <li key={"channel-" + i} onClick={changeRoom.bind(this, room.name)} className="channel">{room.name}</li>
                        );
                    })}
                </ul>

                <form action="#" onSubmit={this.changeChannel}>
                    <input type="text" name="channelname" placeholder="Room name" />
                    <input type="submit" className="form-submit" value="Connect" />
                </form>
            </div>
        );
    }
}