import { Router } from 'express';
import { ErrorCode, SocketError } from '../../errors/socket-error';
import { Chats } from '../../models/chat';

export const router = Router();

router.post('/', async (req, res, next) => {
    const chatId: string = req.body.chatId;

    const chat = await Chats.findOne({ id: chatId });
    if (!chat) {
        next(new SocketError(ErrorCode.BAD_REQUEST, 'Such chat id is not found'));
    }
    res.status(200).json({ response: chat });
});
