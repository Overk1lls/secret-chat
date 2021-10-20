const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const config = require('./config/config.json');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

app.use(express.json({ extended: true }));
app.use(cors());
app.use('/api/form', require('./routes/form'));

try {
    io.on('connection', async (socket) => {
        // joins the given socket
        const { chatId } = socket.handshake.auth;
        socket.join(chatId);

        console.log(`Socket connection is created (${socket.id}) in room (${chatId})`);

        // connection error
        socket.on('connect_error', (err) => { console.log('Socket connect error: ' + err.message); });

        // fetch messages from DB and add them to the socket
        let fetchMessages = await Message.find({ chatId: chatId });

        if (fetchMessages) {
            fetchMessages.map(msg => { io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, msg); });
        }

        // a new message sent
        socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
            let newMessage = new Message({
                ...data,
                chatId: chatId
            });
            await newMessage.save();

            io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, data);
        });

        socket.on('disconnect', () => {
            console.log(`Socket (${socket.id}) disconnected in room (${chatId})`);

            socket.leave(chatId);
        });
    });
} catch (e) {
    console.log('Socket error: ' + e.message);
}

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