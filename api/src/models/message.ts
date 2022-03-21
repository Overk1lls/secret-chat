import { Schema, model } from 'mongoose';

export interface IMessage {
    _id: Schema.Types.ObjectId,
    chat: Schema.Types.ObjectId,
    body: string,
    token: string,
    username: string
}

const schema = new Schema<IMessage>({
    chat: { type: Schema.Types.ObjectId, required: true, ref: 'Chat' },
    body: { type: String, required: true },
    token: { type: String, required: true },
    username: { type: String, required: true }
});

export const Messages = model('Message', schema);
