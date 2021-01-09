import express from "express";
import validateObjectId from "../middleware/validateObjectId";
import validateWith from "../middleware/validateWith";
import { Subscription, subscriptionSchema } from "../../models/subscription";

const subscriptions = express.Router();

export default function (router) {
    router.use("/subscriptions", subscriptions);

    subscriptions.get("/:id", validateObjectId, async (req, res) => {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription)
            return res.status(404).send({
                error: `Couldn't find subscription ${req.params.id}`
            });
        res.send(subscription);
    });

    subscriptions.post("/", validateWith(subscriptionSchema), async (req, res) => {
        const subscription = await Subscription.create(req.body);
        res.status(201).send(subscription);
    });

    subscriptions.put("/:id", [validateObjectId, validateWith(subscriptionSchema)], async (req, res) => {
        const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subscription)
            return res.status(404).send({
                error: `Couldn't find subscription ${req.params.id}`
            });
        res.send(subscription);
    });

    subscriptions.delete("/:id", validateObjectId, async (req, res) => {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription)
            return res.status(404).send({
                error: `Couldn't find subscription ${req.params.id}`
            });
        res.send(subscription);
    });
};
