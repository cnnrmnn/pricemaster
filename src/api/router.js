import { Router } from 'express';
import subscriptions from './routes/subscriptions';

export default function (app) {
    const router = Router();
    subscriptions(router);

    app.use('/api', router);
}
