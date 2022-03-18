import { Schema, model, Types } from 'mongoose';
import { IMessage } from './message';

export interface IChat {
    id: string,
    password: string,
    messages: IMessage[]
}

const schema = new Schema<IChat>({
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    messages: [{ type: Types.ObjectId, ref: 'message', default: [] }]
});

export const ChatModel = model('chat', schema);
