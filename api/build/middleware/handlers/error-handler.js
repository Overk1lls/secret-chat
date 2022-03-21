"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const socket_error_1 = require("../../errors/socket-error");
const errorHandler = (err, req, res, next) => {
    if (err instanceof socket_error_1.SocketError) {
        switch (err.code) {
            case socket_error_1.ErrorCode.BAD_REQUEST: {
                res.status(400).json({ error: err.message });
                break;
            }
            default: {
                res.status(500).json({ error: 'Something went wrong...' });
                break;
            }
        }
    }
    else
        res.status(500).json({ error: 'Something went wrong...' });
    console.error(err);
};
exports.errorHandler = errorHandler;
