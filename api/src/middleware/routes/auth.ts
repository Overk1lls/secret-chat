import { Router } from 'express';
import { generateId } from '../../utils';
import { Chats } from '../../models/chat';
import { createHmac } from 'crypto';
import { config } from 'dotenv';
import { IUser } from '../../interfaces/dto/user.dto';

config();

const { SECRET_KEY } = process.env;

export const router = Router();

router.post('/', async (req, res) => {
    try {
        const { password } = req.body as IUser;
        if (!password) {
            return res.status(400);
        }

        const pwdHash = createHmac('sha256', SECRET_KEY)
            .update(password)
            .digest()
            .toString();

        const token = generateId();

        const chat = await Chats.findOne({ password: pwdHash });
        if (chat) {
            return res.status(200).json({ chatId: chat.id, token });
        }

        const newChat = new Chats({
            id: token,
            password: pwdHash
        });
        await newChat.save();

        res.status(201).send({
            chatId: newChat.id,
            token
        });
    } catch (e) {
        // res.status(500).json({ error: e.message });
        console.error(e);
    }
});
