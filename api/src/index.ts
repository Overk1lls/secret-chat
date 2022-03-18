import { createApp } from './middleware/app';
import { SocketServer } from './services/socket.service';
import { MongoDbConnection } from './services/mongodb.service';
import { config as dotenvInit } from 'dotenv';

dotenvInit();

const { PORT, MONGO_URI } = process.env;

const app = createApp();
const server = new SocketServer(app, parseInt(PORT));

const mongodb = new MongoDbConnection(MONGO_URI);

const start = async () => {
    await mongodb.connect();
    await server.setup();
};

start().catch((err: Error) => {
    console.error(err);
    process.exit(1);
});
