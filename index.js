const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

require('dotenv').config();

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const events = {
    NEW_CHAT_MESSAGE_EVENT: 'newChatMessage',
    NEW_CHAT: 'newChat',
    NEW_USER: 'newUser',
    USER_LEFT: 'userLeft'
};

app.use(express.json({ extended: true }));
app.use(cors());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));

io.on('connection', async socket => {
    socket.on('connect_error', e => {
        console.log('Socket connect error: ' + e.message);
    });

    const { username, chatId } = socket.handshake.auth;
    socket.join(chatId);

    io.in(chatId).emit(events.NEW_USER, {
        body: username + ' has entered the chat'
    });

    try {
        let messages = await Message.find({ chatId });

        if (messages) {
            io.in(chatId).emit('new', messages);
        }
    } catch (e) {
        console.error(e);
    }

    console.log(`Socket connection is created (${socket.id}) in room (${chatId})`);

    socket.on(events.NEW_CHAT_MESSAGE_EVENT, async message => {
        let newMessage = new Message({
            chatId: chatId,
            body: message.body,
            token: message.token,
            username: message.username
        });
        await newMessage.save();

        io.in(chatId).emit(events.NEW_CHAT_MESSAGE_EVENT, {
            body: message.body,
            token: message.token,
            username: message.username
        });
    });

    socket.on('disconnect', () => {
        console.log(`Socket (${socket.id}) disconnected in room (${chatId})`);
        socket.in(chatId).emit(events.USER_LEFT, { body: username + ' has left the chat' });
        socket.leave(chatId);
    });
});

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        server.listen(process.env.PORT | 4000, () => console.log('App has been started on port', process.env.PORT));
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

start();