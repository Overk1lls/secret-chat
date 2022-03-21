export enum ErrorCode {
    SERVER = 'SOMETHING_WENT_WRONG',
    DATABASE = 'DATABASE_ERROR',
    BAD_REQUEST = 'INVALID_REQUEST'
}

export interface IError {
    code: ErrorCode;
    message?: string;
}

export class SocketError extends Error implements IError {
    readonly code: ErrorCode;
    readonly message: string;

    constructor(code: ErrorCode, message?: string) {
        super(message ? message : code);
    }
}
