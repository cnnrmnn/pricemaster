import express from "express";
import helmet from "helmet";
import connectMongo from "./db/mongo";
import router from "./api/router";

const app = express();

async function start() {
    console.log("Connecting to database...");
    await connectMongo();
    console.log("Connected to database.");
     
    app.use(express.json());
    app.use(helmet());

    router(app);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
}

start();
