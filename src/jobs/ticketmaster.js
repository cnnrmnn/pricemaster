import { Subscription } from '../models/subscription';
import { updateCheapestTicket } from '../services/ticketmaster';

export default function (agenda) {
    agenda.define('updateCheapestTicket', async (job) => {
        const { eventId } = job.attrs.data;
        const event = await updateCheapestTicket(eventId);
        if (!event) {
            console.error(
                `Failed to find event ${eventId} or update its cheapest ticket.`
            );
            return;
        }

        // check updated event.cheapestTicket.price against any subscriptions with
        // corresponding event id and send notifications via applicable channels if
        // appropriate
    });
}
