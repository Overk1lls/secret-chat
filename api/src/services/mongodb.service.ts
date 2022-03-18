import { connect, disconnect } from 'mongoose';

export interface IDbConnection {
    connect: () => Promise<void | unknown>;
    disconnect: () => Promise<void>;
}

export class MongoDbConnection implements IDbConnection {
    private _uri: string;

    constructor(uri: string) {
        this._uri = uri;
    }

    public connect = async () => connect(this._uri);

    public disconnect = async () => disconnect();
}
