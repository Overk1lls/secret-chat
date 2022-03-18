import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import './chat.css';

export default function Chat() {
    const token = localStorage.getItem('token');
    const { messages, sendMessage } = useChat(token);
    const [newMessage, setNewMessage] = useState([]);
    const messagesRef = useRef(null);

    useEffect(() => {
        messagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        localStorage.clear();
        window.location.href = 'http://localhost:3000';
    };

    return (
        <div className="container">
            <div className="chat container mt-5">
                <h1 className="text-center pt-3">Chat Room: {localStorage.getItem('chatId')}</h1>
                <div className="flex-column message-wrapper">
                    <ol className="list-group p-4">
                        {messages.map((message, i) => (
                            <li
                                key={i}
                                className={`m-1 d-flex ${message.token === token ? 'justify-content-end' : ''}`}
                            >
                                <h6 className="p-2">{message.username ? message.username + ' >' : ''}</h6>
                                <div className={`p-2 rounded-pill ${message.token ?
                                    message.token === token ?
                                        'list-group-item-success' :
                                        'list-group-item-primary' :
                                    'list-group-item-secondary'}`}>
                                    {message.body}
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div ref={messagesRef} />
                </div>
                <div className="input-group mb-3">
                    <textarea
                        className="form-control"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleEnterPress}
                        placeholder="Write a message..."
                    />
                    <button
                        className="btn btn-outline-primary"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
            <div className="text-center mt-4">
                <Link to='/'>
                    <button
                        className="btn btn-outline-secondary px-5"
                        onClick={handleBackPress}
                    >
                        Back
                    </button>
                </Link>
            </div>
        </div>
    );
}