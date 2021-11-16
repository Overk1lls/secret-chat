const { Router } = require('express');
const router = Router();
const crypto = require('crypto-js');
const config = require('../config/config.json');
const utils = require('../utils/utils');
const Chat = require('../models/Chat');

router.post('/', async (req, res) => {
    try {
        let { password } = req.body;

        let passToSha = crypto.HmacSHA256(password, config.secret_key).toString();
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
            token: utils.generateId() 
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
        console.error(e);
    }
});

module.exports = router;