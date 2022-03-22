import { Schema, model } from 'mongoose';

export interface IChat {
    _id: Schema.Types.ObjectId,
    id: string,
    password: string,
    messages: Schema.Types.ObjectId[]
}

const schema = new Schema<IChat>({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: [] }]
});

export const Chats = model('Chat', schema);
