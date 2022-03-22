import { Router } from 'express';
import { generateId } from '../../utils';
import { Chats, IChat } from '../../models/chat';
import { createHmac } from 'crypto';
import { config } from 'dotenv';
import { IUser } from '../../interfaces/dto/user.dto';
import { ErrorCode, SocketError } from '../../errors/socket-error';

config();

const { SECRET_KEY } = process.env;

export const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { password } = req.body as IUser;
        if (!password) {
            throw new SocketError(ErrorCode.BAD_REQUEST, 'Password is not found');
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

        const newChat: IChat = await Chats.create({
            id: token,
            password: pwdHash
        });

        res.status(201).send({
            chatId: newChat.id,
            token
        });
    } catch (err) {
        next(err);
    }
});
