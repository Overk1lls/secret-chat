import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { ISocketAuth } from '../interfaces/dto/auth.dto';
import { IChatAggregation } from '../interfaces/dto/chat-aggregation';
import { Chats, IChat } from '../models/chat';
import { IMessage, Messages } from '../models/message';

export enum Events {
    NEW_MESSAGE = 'newChatMessage',
    NEW_CHAT = 'newChat',
    NEW_USER = 'newUser',
    USER_LEFT = 'userLeft'
}

export class Socket {
    private _httpServer: HttpServer;
    private _socketServer: SocketServer;
    private _port: number;

    constructor(app: Express.Application, port: number) {
        this._httpServer = createServer(app);
        this._port = port;
    }

    public get socket(): SocketServer {
        return this._socketServer;
    }

    public close = () => {
        this._socketServer.close(() =>
            this._httpServer.close()
        );
    }

    public setup = () => {
        this._httpServer.listen(this._port, () =>
            console.log(`App is running on port ${this._port}`)
        );

        this._socketServer = new SocketServer(this._httpServer, {
            cors: {
                origin: '*'
            }
        });

        this._socketServer.on('connection', async socket => {
            socket.on('connect_error', (err: Error) => console.error(err));

            const { username, chatId } = socket.handshake.auth as ISocketAuth;

            socket.join(chatId);

            this.emitEvent(chatId, Events.NEW_USER, {
                body: `${username} has entered the chat.`
            });

            const chats: IChatAggregation[] = await Chats.aggregate([
                {
                    '$match': {
                        id: chatId
                    }
                },
                {
                    '$project': {
                        messages: 1
                    }
                },
                {
                    '$lookup': {
                        from: 'messages',
                        localField: '_id',
                        foreignField: 'chat',
                        as: 'messages'
                    }
                }
            ]);
            const chat = chats[0];

            if (chat?.messages) {
                this.emitEvent(chatId, Events.NEW_CHAT, chat.messages);
            }
            console.log(`Socket connection ${socket.id} is created in room ${chatId}`);

            socket.on(Events.NEW_MESSAGE, async (message: IMessage) => {
                const msgToObj = {
                    body: message.body,
                    token: message.token,
                    username: message.username
                };
                Messages.create({
                    chat: chat._id,
                    ...msgToObj
                });
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
    ) => this._socketServer.in(room).emit(eventName, obj);
}
