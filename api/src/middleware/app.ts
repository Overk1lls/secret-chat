import express from 'express';
import cors from 'cors';
import { router as authRoute } from './routes/auth';
import { router as chatRoute } from './routes/chat';

export const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use('/api/auth', authRoute);
    app.use('/api/chat', chatRoute);

    return app;
};
