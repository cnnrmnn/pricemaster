import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    cheapestTicket: {
        seat: {
            type: String,
        },
        price: {
            type: Number,
        },
    },
    jobId: String,
    subscriptionIds: [String],
});

export const Event = mongoose.model('Event', schema);
