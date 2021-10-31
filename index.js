const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const config = require('./config/config.json');
const mongoose = require('mongoose');
const cors = require('cors');
// const Message = require('./models/Message');
// require('dotenv').config;

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json({ extended: true }));
app.use(cors());
app.use('/api/form', require('./routes/form'));

io.on('connection', async (socket) => {
    socket.on('connect_error', (e) => {
        console.log('Socket connect error: ' + e.message);
    });

    const { chatId } = socket.handshake.auth;
    socket.join(chatId);

    console.log(`Socket connection is created (${socket.id}) in room (${chatId})`);

    // let fetchMessages = await Message.find({ chatId: chatId });
    // if (fetchMessages) {
    //     fetchMessages.map(msg => { io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, msg); });
    // }

    // socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    //     let newMessage = new Message({
    //         ...data,
    //         chatId: chatId
    //     });
    //     await newMessage.save();

    //     io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    // });

    socket.on(NEW_CHAT_MESSAGE_EVENT, message => {
        io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, {
            body: message.body,
            token: message.token,
            username: message.username
        });
    });

    socket.on('disconnect', () => {
        console.log(`Socket (${socket.id}) disconnected in room (${chatId})`);
        socket.leave(chatId);
    });
});

async function start() {
    try {
        await mongoose.connect(config.mongo_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server.listen(config.port, () => console.log('App has been started on port', config.port));
    } catch (e) {
        console.log('Database error:', e.message);
        process.exit(1);
    }
}

start();