import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useChat from '../../hooks/useChat';
import useToken from '../../hooks/useToken';
import './chat.css';

export default function Chat() {
    const { token } = useToken();
    const { messages, sendMessage } = useChat(token);
    const [newMessage, setNewMessage] = useState([]);
    const history = useHistory();

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage('');
    };

    const handleEnterPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleBackPress = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('chatId');
        localStorage.removeItem('username');
        history.go(0);
    };

    return (
        <div className="container">
            <div className="chat container mt-5">
                <h1 className="text-center pt-3">Chat: {localStorage.getItem('chatId')}</h1>
                <div className="flex-column container">
                    <ol className="list-group p-4">
                        {messages.map((message, i) => (
                            <li
                                key={i}
                                className={`m-1 d-flex ${message.token === token ? 'justify-content-end' : ''}`}
                            >
                                <span className="pt-2">{message.username} |</span>
                                <div className={`mr-4 rounded-pill ${message.token === token ? 'list-group-item active' : 'list-group-item'}`}>
                                    {message.body}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="input-group mb-3">
                    <textarea
                        className="form-control"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleEnterPress}
                        placeholder="Write a message..."
                    />
                    <button className="btn btn-outline-primary" onClick={handleSendMessage}>Send</button>
                </div>
            </div>
            <div className="text-center mt-4">
                <button className="btn btn-outline-secondary px-5" onClick={handleBackPress}>Back</button>
            </div>
        </div>
    );
}