import { useEffect, useRef, useState } from 'react';
import socket from 'socket.io-client';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SERVER_URL = "http://localhost:4000";

export default function useChat() {
    const chatId = localStorage.getItem('chatId');
    const token = localStorage.getItem('token');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = socket(SERVER_URL, {
            auth: { chatId }
        });

        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, message => {
            let incMessage = {
                ...message,
                ownedByCurrentUser: message.token === token
            };
            setMessages(messages => [...messages, incMessage]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [chatId]);

    const sendMessage = content => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: content,
            token: token,
            username: localStorage.getItem('username')
        });
    };

    return { messages, sendMessage };
};