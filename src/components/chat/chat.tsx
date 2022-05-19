import { FC, KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { addDoc, collection, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatMessage } from "./chat-message";
import { auth, firestore } from "../../App";
import { CurrentUserDTO } from "../../models/current-user.dto";

export const Chat: FC = () => {
    const messagesRef = useRef<HTMLSpanElement>(null);
    const [message, setMessage] = useState('');

    const msgCollection = collection(firestore, 'messages');
    const msgQuery = query(msgCollection, orderBy('createdAt'));
    const [messages, loading] = useCollectionData(msgQuery);

    useEffect(() => {
        messagesRef.current!.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (
        e: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        if (!message.length) return;

        const { uid, photoURL } = auth.currentUser as CurrentUserDTO;

        await addDoc(msgCollection, {
            text: message,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        });

        setMessage('');
    };

    const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = e => {
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