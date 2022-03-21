"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.Events = void 0;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const chat_1 = require("../models/chat");
const message_1 = require("../models/message");
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
            this._httpServer.listen(this._port, () => console.log(`App is running on port ${this._port}`));
            this._socketServer = new socket_io_1.Server(this._httpServer, {
                cors: {
                    origin: '*'
                }
            });
            this._socketServer.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
                socket.on('connect_error', (err) => console.error(err));
                const { username, chatId } = socket.handshake.auth;
                socket.join(chatId);
                this.emitEvent(chatId, Events.NEW_USER, {
                    body: `${username} has entered the chat.`
                });
                const chats = yield chat_1.Chats.aggregate([
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
                if (chat === null || chat === void 0 ? void 0 : chat.messages) {
                    this.emitEvent(chatId, Events.NEW_CHAT, chat.messages);
                }
                console.log(`Socket connection ${socket.id} is created in room ${chatId}`);
                socket.on(Events.NEW_MESSAGE, (message) => __awaiter(this, void 0, void 0, function* () {
                    const msgToObj = {
                        body: message.body,
                        token: message.token,
                        username: message.username
                    };
                    message_1.Messages.create(Object.assign({ chat: chat._id }, msgToObj));
                    this.emitEvent(chatId, Events.NEW_MESSAGE, msgToObj);
                }));
                socket.on('disconnect', () => {
                    console.log(`Socket ${socket.id} disconnected in room ${chatId}`);
                    this.emitEvent(chatId, Events.USER_LEFT, {
                        body: `${username} has left the chat.`
                    });
                    socket.leave(chatId);
                });
            }));
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
