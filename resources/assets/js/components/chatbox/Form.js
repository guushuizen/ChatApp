import React, { Component } from 'react';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    submit(event) {
        event.preventDefault();
        this.sendMessage();
    }

    sendMessage() {
        let message = document.querySelector("textarea[name=message]").value;
        console.log(message);
        this.props.submit(event, message);
    }

    componentDidMount() {
        document.querySelector('textarea').addEventListener('keypress', (event) => {
            if (event.code === "Enter" && event.ctrlKey) {
                event.preventDefault();
                this.sendMessage();
                return false;
            }
        });
    }

    render() {
        return (
            <div className="reply-container">
                <div className="reply-form">
                    <p className="form-header">Reply</p>
                    <form className="chat-form" onSubmit={this.submit}>
                        <textarea type="text" name="message" placeholder="Type a new message here, then use Ctrl+Enter to send the message." />
                        <div className="button-wrapper">
                            <input type="submit" value="Send" className="btn" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}