import { useState } from 'react';
import { fetchAPI } from '../../lib/utils';

export const SERVER_URL = 'http://localhost:4000';
export const storages = {
    TOKEN: 'token',
    USERNAME: 'username',
    CHAT_ID: 'chatId'
};
export const ERR_MESSAGE = 'Something went wrong...';

export default function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async event => {
        event.preventDefault();

        if (!username && !password) return setError('Please, enter name and password!');
        setError('');

        const authData = await fetchAPI({
            url: `${SERVER_URL}/api/auth`,
            method: 'POST',
            body: JSON.stringify({ password }),
        });
        if (!authData || (authData && authData.error)) {
            return setError(!authData ? ERR_MESSAGE : authData.error);
        }
        const { token, chatId } = authData;

        const localToken = localStorage.getItem(storages.TOKEN);
        if (!localToken) localStorage.setItem(storages.TOKEN, token);

        localStorage.setItem(storages.USERNAME, username);
        localStorage.setItem(storages.CHAT_ID, chatId);
        
        window.location.href = `${window.location.origin}/chat/${chatId}`;
    }

    return (
        <div className="mt-5">
            <form>
                {error ?
                    <div className="alert alert-danger">{error}</div> :
                    ''
                }
                <h3 className="text-center">Secret Web-Chat</h3>
                <div className="form-group mb-2">
                    <label htmlFor="inputName">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="inputName"
                        placeholder="Your name"
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="inputPassword">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Enter password for the certain chat room"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-center mt-4">
                    <button
                        type="submit"
                        className="btn btn-outline-dark text-center px-5"
                        onClick={submitHandler}
                    >
                        Enter
                    </button>
                </div>
            </form>
        </div>
    );
};
