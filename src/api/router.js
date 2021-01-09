import { Router } from "express";
import { Subscription, validateSubscription } from "../models/subscription";

export default function (app) {
    const router = Router();
    
    app.use("/api", router);
};
