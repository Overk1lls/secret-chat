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
const utils_1 = require("../../utils");
const chat_1 = require("../../models/chat");
const crypto_1 = require("crypto");
const dotenv_1 = require("dotenv");
const socket_error_1 = require("../../errors/socket-error");
(0, dotenv_1.config)();
const { SECRET_KEY } = process.env;
exports.router = (0, express_1.Router)();
exports.router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        if (!password) {
            throw new socket_error_1.SocketError(socket_error_1.ErrorCode.BAD_REQUEST, 'No password');
        }
        const pwdHash = (0, crypto_1.createHmac)('sha256', SECRET_KEY)
            .update(password)
            .digest()
            .toString();
        const token = (0, utils_1.generateId)();
        const chat = yield chat_1.Chats.findOne({ password: pwdHash });
        if (chat) {
            return res.status(200).json({ chatId: chat.id, token });
        }
        const newChat = yield chat_1.Chats.create({
            id: token,
            password: pwdHash
        });
        res.status(201).send({
            chatId: newChat.id,
            token
        });
    }
    catch (err) {
        next(err);
    }
}));
