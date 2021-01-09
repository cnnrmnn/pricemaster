import mongoose from "mongoose";

export default async () =>
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
