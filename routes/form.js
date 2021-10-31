const { Router } = require('express');
const router = Router();
const crypto = require('crypto-js');
const config = require('../config/config.json');
const utils = require('../utils/utils');
const Chat = require('../models/Chat');
// require('dotenv').config;

router.post('/', async (req, res) => {
    try {
        let { password } = req.body;
        let encryptPassword = crypto.HmacSHA256(password, config.secret_key).toString();
        
        let chat = await Chat.findOne({ password: encryptPassword });
        if (chat) {
            res.send({ chatId: chat.id });
        } else {
            let newChat = new Chat({
                id: utils.generateId(),
                password: encryptPassword
            });
            newChat.save();

            res.status(201).send({ chatId: newChat.id });
        }
    } catch (e) {
        res.status(500).send(e);
        console.log('post api/form error: ' + e.message);
    }
});

module.exports = router;