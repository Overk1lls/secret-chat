"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["SERVER"] = "SOMETHING_WENT_WRONG";
    ErrorCode["DATABASE"] = "DATABASE_ERROR";
    ErrorCode["BAD_REQUEST"] = "INVALID_REQUEST";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class SocketError extends Error {
    constructor(code, message) {
        super(message ? message : code);
    }
}
exports.SocketError = SocketError;
