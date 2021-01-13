import mongoose from 'mongoose';

export default async () =>
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
