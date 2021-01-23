import express from 'express';
import validateObjectId from '../middleware/validateObjectId';
import validateWith from '../middleware/validateWith';
import { Subscription, subscriptionSchema } from '../../models/subscription';
import {
    createSubscription,
    updateSubscription,
    deleteSubscription,
} from '../../services/subscription';
import { NotFoundError } from '../../errors';

const subscriptions = express.Router();

export default function (router) {
    router.use('/subscriptions', subscriptions);

    subscriptions.get('/:id', validateObjectId, async (req, res, next) => {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription)
            return next(
                new NotFoundError(`Couldn't find subscription ${req.params.id}`)
            );
        res.send(subscription);
    });

    subscriptions.post(
        '/',
        validateWith(subscriptionSchema),
        async (req, res) => {
            const subscription = await createSubscription(req.body);
            res.status(201).send(subscription);
        }
    );

    subscriptions.put(
        '/:id',
        [validateObjectId, validateWith(subscriptionSchema)],
        async (req, res, next) => {
            const subscription = await updateSubscription(
                req.params.id,
                req.body
            );
            if (!subscription)
                return next(
                    new NotFoundError(
                        `Couldn't find subscription ${req.params.id}`
                    )
                );
            res.send(subscription);
        }
    );

    subscriptions.delete('/:id', validateObjectId, async (req, res, next) => {
        const subscription = await deleteSubscription(req.params.id);
        if (!subscription)
            return next(
                new NotFoundError(`Couldn't find subscription ${req.params.id}`)
            );
        res.send(subscription);
    });
}
