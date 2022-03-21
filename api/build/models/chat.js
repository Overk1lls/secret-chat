"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chats = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    messages: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Message', default: [] }]
});
exports.Chats = (0, mongoose_1.model)('Chat', schema);
