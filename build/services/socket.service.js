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
exports.SocketServer = exports.Events = void 0;
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
class SocketServer {
    constructor(app, port) {
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
            const httpServer = (0, http_1.createServer)(this._app);
            httpServer.listen(this._port, () => console.log(`App is running on port ${this._port}`));
            this._server = new socket_io_1.Server(httpServer, {
                cors: {
                    origin: '*',
                },
            });
            this._server.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
                socket.on('connect_error', (err) => console.error(err));
                const { username, chatId } = socket.handshake.auth;
                socket.join(chatId);
                this.emitEvent(chatId, Events.NEW_USER, {
                    body: `${username} has entered the chat.`
                });
                const chat = yield chat_1.ChatModel.find({ chatId });
                if (chat.messages) {
                    this.emitEvent(chatId, Events.NEW_CHAT, chat.messages);
                }
                console.log(`Socket connection ${socket.id} is created in room ${chatId}`);
                socket.on(Events.NEW_MESSAGE, (message) => __awaiter(this, void 0, void 0, function* () {
                    const msgToObj = {
                        body: message.body,
                        token: message.token,
                        username: message.username
                    };
                    const msg = new message_1.MessageModel(Object.assign({ chatId }, msgToObj));
                    yield msg.save();
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
        });
        this.emitEvent = (room, eventName, obj) => this._server.in(room).emit(eventName, obj);
        this._app = app;
        this._port = port;
    }
    get socket() {
        return this._server;
    }
}
exports.SocketServer = SocketServer;
