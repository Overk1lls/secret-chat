import { Router } from 'express';
import { generateId } from '../../utils';
import { ChatModel } from '../../models/chat';
import { createHmac } from 'crypto';
import { config } from 'dotenv';

config();

const { SECRET_KEY } = process.env;

export const router = Router();

router.post('/', async (req, res) => {
    try {
        const password: string = req.body.password;
        const token = generateId();

        const pwdHash = createHmac('sha256', SECRET_KEY)
            .update(password)
            .digest()
            .toString();

        const chat = await ChatModel.findOne({ password: pwdHash });
        if (chat) {
            res.json({ chatId: chat.id, token });
        }

        const newChat = new ChatModel({
            id: generateId(),
            password: pwdHash
        });
        await newChat.save();

        res.status(201).send({
            chatId: newChat.id,
            token
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});
