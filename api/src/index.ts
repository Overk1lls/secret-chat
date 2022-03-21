import { createApp } from './middleware/app';
import { Socket } from './services/socket';
import { MongoDbConnection } from './services/mongodb';
import { config as dotenvInit } from 'dotenv';

dotenvInit();

const { PORT, MONGO_URI } = process.env;

const app = createApp();
const server = new Socket(app, parseInt(PORT));

const mongodb = new MongoDbConnection(MONGO_URI);

const start = async () => {
    await mongodb.connect();
    server.setup();
};

start().catch((err: Error) => {
    console.error(err);
    process.exit(1);
});
