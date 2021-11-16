import { useEffect, useRef, useState } from 'react';
import socket from 'socket.io-client';

const events = {
    NEW_CHAT_MESSAGE_EVENT: 'newChatMessage',
    NEW_CHAT: 'newChat'
};
const SERVER_URL = "http://localhost:4000";

export default function useChat(token) {
    const username = localStorage.getItem('username');
    const chatId = localStorage.getItem('chatId');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socket(SERVER_URL, {
            auth: { chatId }
        });
        
        socketRef.current.on(events.NEW_CHAT, msgs => {
            setMessages(msgs);
        });

        socketRef.current.on(events.NEW_CHAT_MESSAGE_EVENT, message => {
            setMessages(messages => [...messages, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [chatId, token]);

    const sendMessage = content => {
        socketRef.current.emit(events.NEW_CHAT_MESSAGE_EVENT, {
            body: content,
            token,
            username
        });
    };

    return { messages, sendMessage };
};