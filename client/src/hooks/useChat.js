import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { SERVER_URL, storages } from '../components/auth/auth';

export const events = {
    NEW_MESSAGE: 'newChatMessage',
    NEW_CHAT: 'newChat',
    NEW_USER: 'newUser',
    USER_LEFT: 'userLeft'
};

export const useChat = token => {
    const username = localStorage.getItem(storages.USERNAME);
    const chatId = localStorage.getItem(storages.CHAT_ID);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(SERVER_URL, {
            auth: {
                username,
                chatId
            }
        });

        socketRef.current.on(events.NEW_CHAT, messages => setMessages(messages));

        socketRef.current.on(events.NEW_MESSAGE, message => {
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
        socketRef.current.emit(events.NEW_MESSAGE, {
            body: content,
            token,
            username
        });
    };

    return { messages, sendMessage };
};
