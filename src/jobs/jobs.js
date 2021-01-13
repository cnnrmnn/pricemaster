import Agenda from 'agenda';
import ticketmaster from './ticketmaster';

export const agenda = new Agenda({
    db: {
        address: process.env.DB_CONNECTION_STRING,
        collection: 'jobs',
    },
    processEvery: '30 seconds',
});

export async function loadJobs() {
    await agenda.start();

    ticketmaster(agenda);
}
