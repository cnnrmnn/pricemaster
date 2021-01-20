import express from 'express';
import connectMongo from './db/mongo';
import router from './api/router';
import { loadJobs } from './jobs/jobs';

const app = express();

async function start() {
    console.log('Connecting to database...');
    await connectMongo();
    console.log('Connected to database.');

    console.log('Loading jobs...');
    await loadJobs();
    console.log('Loaded jobs.');

    router(app);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
}

start();
