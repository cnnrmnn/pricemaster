import { Event } from '../models/event';
import { agenda } from '../jobs/jobs';

export async function upsertEvent(eventId, body) {
    const event = await Event.findByIdAndUpdate(eventId, body, {
        upsert: true,
        new: true,
    });
    if (!event) {
        console.error(`Failed to upsert event ${eventId}.`);
        return;
    }
    if (!event.jobId) {
        const job = agenda.create('updateCheapestTicket', { eventId });
        job.repeatEvery(process.env.UPDATE_INTERVAL, { endDate: event.date });
        await job.save();
        event.jobId = job.attrs._id;
        await event.save();
    }
    return event;
}
