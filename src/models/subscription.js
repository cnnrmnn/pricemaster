import Joi from "joi";
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: String,
    phone: String,
    eventId: String,
    price: Number
});

export const Subscription = mongoose.model('Subscription', schema);

export const subscriptionSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2}).messages({
        "string.email": "Invalid email"
    }),
    phone: Joi.string().length(11).pattern(/^[0-9]+$/).messages({
        "string.length": "Invalid phone number",
        "string.pattern": "Invalid phone number"
    }),
    eventId: Joi.string().required().messages({
        "any.required": "Please provide an event ID"
    }),
    price: Joi.number().min(0).messages({
        "number.min": "Price must be greater than 0"
    })
}); 
