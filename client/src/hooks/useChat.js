import { useEffect, useRef, useState } from 'react';
import socket from 'socket.io-client';

const events = {
    NEW_CHAT_MESSAGE_EVENT: 'newChatMessage',
    NEW_CHAT: 'newChat',
    NEW_USER: 'newUser',
    USER_LEFT: 'userLeft'
};
const SERVER_URL = "http://localhost:4000";

export default function useChat(token) {
    const username = localStorage.getItem('username');
    const chatId = localStorage.getItem('chatId');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socket(SERVER_URL, {
            auth: { username, chatId }
        });
        
        socketRef.current.on(events.NEW_CHAT, msgs => {
            setMessages(msgs);
        });

        socketRef.current.on(events.NEW_CHAT_MESSAGE_EVENT, message => {
            setMessages(messages => [...messages, message]);
        });

        socketRef.current.on(events.NEW_USER, ({ body }) => {
            setMessages(messages => [...messages, { body }]);
        });
        socketRef.current.on(events.USER_LEFT, ({ body }) => {
            setMessages(messages => [...messages, { body }]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [chatId, token, username]);

    const sendMessage = content => {
        socketRef.current.emit(events.NEW_CHAT_MESSAGE_EVENT, {
            body: content,
            token,
            username
        });
    };

    return { messages, sendMessage };
};