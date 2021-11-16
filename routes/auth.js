const { Router } = require('express');
const router = Router();
const crypto = require('crypto-js');
const utils = require('../utils/utils');
const Chat = require('../models/Chat');

require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        let { password } = req.body;
        let token = utils.generateId();

        let passToSha = crypto.HmacSHA256(password, process.env.SECRET_KEY).toString();
        let chat = await Chat.findOne({ password: passToSha });

        if (chat) {
            return res.json({ chatId: chat.id, token });
        }

        let newChat = new Chat({
            id: utils.generateId(),
            password: passToSha
        });
        await newChat.save();

        return res.status(201).send({ 
            chatId: newChat.id,
            token
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});

module.exports = router;