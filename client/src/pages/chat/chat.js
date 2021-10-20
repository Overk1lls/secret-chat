import React, { useState } from 'react';
import useChat from '../../hooks/useChat';
import { Link } from 'react-router-dom';
import './chat.css';

const Chat = (props) => {
    const { chatId } = props.match.params;
    const { messages, sendMessage } = useChat(chatId);
    const [newMessage, setNewMessage] = useState();

    const handleSendMessage = () => {
        sendMessage(newMessage);
        setNewMessage('');
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleBackPress = () => {
        localStorage.removeItem('token');
    };

    return (
        <div className="container">
            <div className="chat container mt-5">
                <h1 className="text-center pt-3">Chat: {chatId}</h1>

                <div className="flex-column container">
                    <ol className="list-group p-4">
                        {messages.map((message, i) => (
                            <li
                                key={i}
                                className={`m-1 d-flex ${message.ownedByCurrentUser ? 'justify-content-end' : ''}`}
                            >
                                <div className={`${message.ownedByCurrentUser ? 'list-group-item active' : 'list-group-item'}`}>
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
                <Link to={'/'}><button className="btn btn-outline-secondary px-5" onClick={handleBackPress}>Back</button></Link>
            </div>
        </div>
    );
}

export default Chat;