"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    chat: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Chat' },
    body: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true }
});
exports.Messages = (0, mongoose_1.model)('Message', schema);
