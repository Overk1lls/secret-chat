"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    chatId: { type: String, required: true, ref: 'chat' },
    body: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true }
});
exports.MessageModel = (0, mongoose_1.model)('message', schema);
