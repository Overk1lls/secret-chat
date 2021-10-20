import React from 'react';
// import PropTypes from 'prop-types';

const SERVER_URL = 'http://localhost:4000/';

async function Auth(credentials) {
    return fetch(SERVER_URL + 'api/form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json());
}

export default function Form({ setToken }) {
    const [username, setUserName] = React.useState();
    const [password, setPassword] = React.useState();

    const submitHandler = async e => {
        e.preventDefault();

        if (username && password) {
            let token = await Auth({ username, password });
            // setToken(token);
            window.location.replace('http://localhost:3000/' + token.id);
        }
    }

    return (
        <form className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Secret Chat</h2>
                                    <p className="text-white-50 mb-5">Please enter your name and password!</p>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            className="form-control form-control-lg"
                                            placeholder="Username"
                                            onChange={e => setUserName(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-outline form-white mb-4">
                                        <input
                                            className="form-control form-control-lg"
                                            placeholder="Password"
                                            onChange={e => setPassword(e.target.value)}
                                            type="password"
                                        />
                                    </div>

                                    <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={submitHandler}>Enter</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

// Form.propTypes = {
//     setToken: PropTypes.func.isRequired
// };