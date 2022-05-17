import { useEffect, useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatMessage } from "./chat-message";
import { auth, firestore } from "../../App";

export const Chat = () => {
    const messagesRef = useRef(null);
    const [message, setMessage] = useState('');

    const msgCollection = collection(firestore, 'messages');
    const [messages, loading] = useCollectionData(msgCollection);

    useEffect(() => {
        messagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async e => {
        e.preventDefault();

        if (!message.length) return;

        const { uid, photoURL } = auth.currentUser;

        await addDoc(msgCollection, {
            text: message,
            createdAt: new Date(),
            uid,
            photoURL
        });

        setMessage('');
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    return (
        <div className='chat'>
            <div className='flex-column message-wrapper'>
                <ol className='list-group p-4'>
                    {loading && (<h2 className='text-center'>Data is loading...</h2>)}
                    {messages?.length && (
                        messages.map((message, i) => <ChatMessage message={message} i={i} />)
                    )}
                    <span ref={messagesRef}></span>
                </ol>
            </div>
            <div className='input-group p-2 mb-2'>
                <textarea className='form-control'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder='Write a message'
                />
                <button className='btn btn-outline-primary'
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};