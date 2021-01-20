import express from 'express';
import helmet from 'helmet';
import subscriptions from './routes/subscriptions';
import error from './middleware/error';

export default function (app) {
    const router = express.Router();
    subscriptions(router);

    app.use(express.json());
    app.use(helmet());

    app.use('/api', router);

    app.use(error);
}
