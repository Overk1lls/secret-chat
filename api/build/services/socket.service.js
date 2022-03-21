"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.Events = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
var Events;
(function (Events) {
    Events["NEW_MESSAGE"] = "newChatMessage";
    Events["NEW_CHAT"] = "newChat";
    Events["NEW_USER"] = "newUser";
    Events["USER_LEFT"] = "userLeft";
})(Events = exports.Events || (exports.Events = {}));
class Socket {
    constructor(app, port) {
        this.close = () => {
            this._socketServer.close(() => this._httpServer.close());
        };
        this.setup = () => {
            this._socketServer = new socket_io_1.Server(this._httpServer, {
                cors: {
                    origin: '*'
                }
            });
            this._httpServer.listen(this._port, () => console.log(`App is running on port ${this._port}`));
            this._socketServer.use((socket, next) => {
                socket.on('connection', () => {
                    console.log('connected');
                });
            });
            // this._socketServer.on('connection', async socket => {
            //     console.log('connected');
            //     socket.on('connect_error', (err: Error) => console.error(err));
            //     const { username, chatId } = socket.handshake.auth as ISocketAuth;
            //     socket.join(chatId);
            //     this.emitEvent(chatId, Events.NEW_USER, {
            //         body: `${username} has entered the chat.`
            //     });
            //     const chat = await ChatModel.find({ chatId }) as IChat;
            //     if (chat.messages) {
            //         this.emitEvent(chatId, Events.NEW_CHAT, chat.messages);
            //     }
            //     console.log(`Socket connection ${socket.id} is created in room ${chatId}`);
            //     socket.on(Events.NEW_MESSAGE, async (message: IMessage) => {
            //         const msgToObj = {
            //             body: message.body,
            //             token: message.token,
            //             username: message.username
            //         };
            //         const msg = new MessageModel({
            //             chatId,
            //             ...msgToObj
            //         });
            //         await msg.save();
            //         this.emitEvent(chatId, Events.NEW_MESSAGE, msgToObj);
            //     });
            //     socket.on('disconnect', () => {
            //         console.log(`Socket ${socket.id} disconnected in room ${chatId}`);
            //         this.emitEvent(chatId, Events.USER_LEFT, {
            //             body: `${username} has left the chat.`
            //         });
            //         socket.leave(chatId);
            //     });
            // });
        };
        this.emitEvent = (room, eventName, obj) => this._socketServer.in(room).emit(eventName, obj);
        this._httpServer = (0, http_1.createServer)(app);
        this._port = port;
    }
    get socket() {
        return this._socketServer;
    }
}
exports.Socket = Socket;
