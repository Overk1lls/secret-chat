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
(0, dotenv_1.config)();
const { SECRET_KEY } = process.env;
exports.router = (0, express_1.Router)();
exports.router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const token = (0, utils_1.generateId)();
        const pwdHash = (0, crypto_1.createHmac)('sha256', SECRET_KEY)
            .update(password)
            .digest()
            .toString();
        const chat = yield chat_1.ChatModel.findOne({ password: pwdHash });
        if (chat) {
            res.json({ chatId: chat.id, token });
        }
        const newChat = new chat_1.ChatModel({
            id: (0, utils_1.generateId)(),
            password: pwdHash
        });
        yield newChat.save();
        res.status(201).send({
            chatId: newChat.id,
            token
        });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
}));
