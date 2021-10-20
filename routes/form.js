const Chat = require('../models/Chat');
const crypto = require('crypto-js');
const config = require('../config/config.json');
const { Router } = require('express');
const router = Router();

const generateId = () => { return Math.random().toString(36).substr(2, 9) };

router.post('/', async (req, res) => {
    try {
        let { name, password } = req.body;

        let encryptPassword = crypto.HmacSHA256(password, config.secret_key).toString();
        
        let chat = await Chat.findOne({ password: encryptPassword });

        if (chat) {
            res.send({ id: chat.id });
        } else {
            // let docCount = await Chat.countDocuments({});
            let newChat = new Chat({
                id: generateId(),
                password: encryptPassword
            });
            newChat.save();

            res.send({ id: newChat.id });
        }
    } catch (e) {
        console.log('post api/form error: ' + e.message);
    }
});

router.post('/:id', async (req, res) => {
    
});

module.exports = router;