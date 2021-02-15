import { Event } from '../models/event';
import { agenda } from '../jobs/jobs';

export async function upsertEvent(eventId, body) {
    let event;
    try {
        event = await Event.findByIdAndUpdate(eventId, body, {
            upsert: true,
            new: true,
        });
    } catch (error) {
        console.error(`Failed to upsert event ${eventId}.`);
        console.error(error);
    }

    if (!event) {
        console.error(`Failed to upsert event ${eventId}.`);
        return;
    }

    if (!event.jobId) {
        let job;
        try {
            job = agenda.create('updateCheapestTicket', { eventId });
            job.repeatEvery(process.env.UPDATE_INTERVAL, {
                endDate: event.date,
            });
            await job.save();
        } catch (error) {
            console.error(
                `Failed to create updateCheapestTicket job for event ${eventId}`
            );
        }

        try {
            event.jobId = job.attrs._id;
            await event.save();
        } catch (error) {
            console.error(
                `Failed to save job ${job.attrs._id} to event ${eventId}`
            );
            console.error(error);
        }
    }
    return event;
}
