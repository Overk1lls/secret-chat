const { Router } = require('express');
const router = Router();
const Message = require('../models/message');

router.post('/', async (req, res, next) => {
    try {
        let { chatId } = req.body;
        let messages = await Message.find({ chatId });

        if (messages) {
            return res.json(messages);
        }

        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});

module.exports = router;