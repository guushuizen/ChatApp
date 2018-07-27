import React, { Component } from 'react';

export default class Form extends Component {

    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }

    submit(event) {
        event.preventDefault();
        this.sendMessage();
    }

    sendMessage() {
        let chatMessage = document.querySelector("textarea[name=message]").value;

        let message = {
            type: 'new_message',
            message: chatMessage
        };

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

    openUpload() {
        document.querySelector('input[type=file]').click();
    }

    handleUpload(event) {
        let file = event.target.files[0];
        let formData = new FormData();

        formData.append('file', file);
        formData.append('username', this.props.username);

        console.log(formData);

        document.querySelector('span.uploading').classList.toggle('hidden');
        document.querySelector('.upload').classList.toggle('hidden');

        fetch('/api/chat/upload', {
            method: 'POST',
            body: formData
        }).then((response) => {
            console.log(response);
            response.json().then((data) => {
                console.log('data from json promise: ', data);
            });
        }).then((data) => {
            console.log('data from fetch promise: ', data);

            document.querySelector('span.uploading').classList.toggle('hidden');
            document.querySelector('.upload').classList.toggle('hidden');
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
                            <span className="uploading hidden">Uploading...</span>

                            <div className="upload" onClick={this.openUpload} href="#"><img src="/img/attachment.svg" /></div>
                            <input type="submit" value="Send" className="btn" />

                            <input type="file" name="attachment" onChange={this.handleUpload} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}