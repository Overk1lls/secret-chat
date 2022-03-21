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
exports.router = void 0;
const express_1 = require("express");
const socket_error_1 = require("../../errors/socket-error");
const chat_1 = require("../../models/chat");
exports.router = (0, express_1.Router)();
exports.router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = req.body.chatId;
    const chat = yield chat_1.Chats.findOne({ id: chatId });
    if (!chat) {
        next(new socket_error_1.SocketError(socket_error_1.ErrorCode.BAD_REQUEST, 'Such chat id is not found'));
    }
    res.status(200).json({ response: chat });
}));
