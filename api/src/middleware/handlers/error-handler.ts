import { ErrorRequestHandler } from 'express';
import { ErrorCode, SocketError } from '../../errors/socket-error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof SocketError) {
        switch (err.code) {
            case ErrorCode.BAD_REQUEST: {
                res.status(400).json({ error: err.message });
                break;
            }

            default: {
                res.status(500).json({ error: 'Something went wrong...' });
                break;
            }
        }
    } else res.status(500).json({ error: 'Something went wrong...' });
    
    console.error(err);
};
