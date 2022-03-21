import { Router } from 'express';
import { Messages } from '../../models/message';

export const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const chatId: string = req.body.chatId;

        // const messages = await MessageModel.find({ chatId });
        // if (messages) {
        //     res.json(messages);
        // }

        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});
