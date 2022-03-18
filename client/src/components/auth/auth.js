import React, { useState } from 'react';

const SERVER_URL = 'http://localhost:4000';

const Auth = async credentials => {
    return fetch(SERVER_URL + '/api/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        .catch(e => console.log(e.message));
};

export default function Form() {
    const token = localStorage.getItem('token');
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [response, setResponse] = useState('');

    const submitHandler = async e => {
        e.preventDefault();

        if (name && password) {
            let data = await Auth({ password });

            if (data.error) setResponse('Something went wrong...');
            if (!token && data.token) localStorage.setItem('token', data.token);

            localStorage.setItem('username', name);
            localStorage.setItem('chatId', data.chatId);

            window.location.href = 'http://localhost:3000/chat/' + data.chatId;
        } else setResponse('Please, enter name and password!');
    }

    return (
        <div className="mt-5">
            <form onSubmit={submitHandler}>
                {response ? <div className="alert alert-danger">{response}</div> : response}
                <h3 className="text-center">Secret Web-Chat</h3>
                <div className="form-group mb-2">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" className="form-control" id="inputName" placeholder="Your name" onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Enter password for the certain chat room" onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-outline-dark text-center px-5">Enter</button>
                </div>
            </form>
        </div>
    );
}