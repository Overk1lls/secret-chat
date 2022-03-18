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
const message_1 = require("../../models/message");
exports.router = (0, express_1.Router)();
exports.router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = req.body.chatId;
        const messages = yield message_1.MessageModel.find({ chatId });
        if (messages) {
            res.json(messages);
        }
        next();
    }
    catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
}));