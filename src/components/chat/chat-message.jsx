import { auth } from "../../App";

export const ChatMessage = ({ message, i }) => {
    const { text, uid, photoURL } = message;

    const isAuthor = uid === auth.currentUser.uid;

    return (
        <li
            key={i}
            className={`m-1 d-flex ${isAuthor && 'justify-content-end'}`}
        >
            <h6 className={
                `p-2 m-1 rounded-pill ${isAuthor ?
                    'list-group-item-success' :
                    'list-group-item-primary'
                }`
            }>
                {text}
            </h6>
            <img src={photoURL} alt="user_photo" />
        </li>
    );
};