import { Schema, model } from 'mongoose';

export interface IMessage {
    chatId: string,
    body: string,
    token: string,
    username: string
}

const schema = new Schema<IMessage>({
    chatId: { type: String, required: true, ref: 'chat' },
    body: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true }
});

export const MessageModel = model('message', schema);
