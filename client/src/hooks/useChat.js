import { useEffect, useRef, useState } from 'react';
import socket from 'socket.io-client';

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SERVER_URL = "http://localhost:4000";

const useChat = (chatId) => {
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        // creates a WebSocket connection
        socketRef.current = socket(SERVER_URL, {
            auth: { chatId }
        });

        // listens for incoming messages
        socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id
            };
            setMessages(messages => [...messages, incomingMessage]);
        });

        // destroys the socket when the connection is closed
        return () => {
            setMessages([]);
            socketRef.current.disconnect();
        };
    }, [chatId]);

    // sends a message to the server that pushes it to the chat
    const sendMessage = (content) => {
        socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
            body: content,
            senderId: socketRef.current.id
        });
    };

    return { messages, sendMessage };
};

export default useChat;