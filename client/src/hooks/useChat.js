import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const events = {
    NEW_MESSAGE: 'newChatMessage',
    NEW_CHAT: 'newChat',
    NEW_USER: 'newUser',
    USER_LEFT: 'userLeft'
};
const SERVER_URL = "http://localhost:4000";

export const useChat = token => {
    const username = localStorage.getItem('username');
    const chatId = localStorage.getItem('chatId');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            auth: {
                username,
                chatId
            }
        });

        socketRef.current.on(events.NEW_CHAT, messages => setMessages(messages));

        socketRef.current.on(events.NEW_MESSAGE, message => {
            console.log('this:12321', message);
            setMessages(messages => [...messages, message]);
        });

        socketRef.current.on(events.NEW_USER, ({ body }) =>
            setMessages(messages => [...messages, { body }])
        );

        socketRef.current.on(events.USER_LEFT, ({ body }) =>
            setMessages(messages => [...messages, { body }])
        );

        return () => socketRef.current.disconnect();
    }, [chatId, username, token]);

    const sendMessage = content => {
        console.log(messages);
        socketRef.current.emit(events.NEW_MESSAGE, {
            body: content,
            token,
            username
        });
    };

    return { messages, sendMessage };
};