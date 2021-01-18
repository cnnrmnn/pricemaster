import { Event } from '../models/event';

export async function upsertEvent(id, body) {
    const event = await Event.findByIdAndUpdate(eventId, body, {
        upsert: true,
    });
    return event;
}
