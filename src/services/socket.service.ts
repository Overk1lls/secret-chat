import { createServer } from 'http';
import { Server } from 'socket.io';
import { ISocketAuth } from '../interfaces/dto/auth.dto';
import { ChatModel, IChat } from '../models/chat';
import { IMessage, MessageModel } from '../models/message';

export enum Events {
    NEW_MESSAGE = 'newChatMessage',
    NEW_CHAT = 'newChat',
    NEW_USER = 'newUser',
    USER_LEFT = 'userLeft'
}

export class SocketServer {
    private _app: Express.Application;
    private _server: Server;
    private _port: number;

    constructor(app: Express.Application, port: number) {
        this._app = app;
        this._port = port;
    }

    public get socket(): Server {
        return this._server;
    }

    public setup = async () => {
        const httpServer = createServer(this._app);
        httpServer.listen(this._port, () =>
            console.log(`App is running on port ${this._port}`)
        );

        this._server = new Server(httpServer, {
            cors: {
                origin: '*',
            },
        });

        this._server.on('connection', async socket => {
            socket.on('connect_error', (err: Error) => console.error(err));

            const { username, chatId } = socket.handshake.auth as ISocketAuth;

            socket.join(chatId);

            this.emitEvent(chatId, Events.NEW_USER, {
                body: `${username} has entered the chat.`
            });

            const chat = await ChatModel.find({ chatId }) as IChat;
            if (chat.messages) {
                this.emitEvent(chatId, Events.NEW_CHAT, chat.messages);
            }
            console.log(`Socket connection ${socket.id} is created in room ${chatId}`);

            socket.on(Events.NEW_MESSAGE, async (message: IMessage) => {
                const msgToObj = {
                    body: message.body,
                    token: message.token,
                    username: message.username
                };
                const msg = new MessageModel({
                    chatId,
                    ...msgToObj
                });
                await msg.save();

                this.emitEvent(chatId, Events.NEW_MESSAGE, msgToObj);
            });

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected in room ${chatId}`);
                this.emitEvent(chatId, Events.USER_LEFT, {
                    body: `${username} has left the chat.`
                });
                socket.leave(chatId);
            });
        });
    };

    private emitEvent = (
        room: string | string[],
        eventName: string,
        obj: object
    ) => this._server.in(room).emit(eventName, obj);
}
