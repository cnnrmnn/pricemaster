import { Event } from '../models/event';
import { Subscription } from '../models/subscription';
import { updateCheapestTicket } from '../services/ticketmaster';
import { sendText } from '../services/twilio';
import { sendEmail } from '../services/mailgun';

export default function (agenda) {
    agenda.define('updateCheapestTicket', async (job) => {
        const { eventId } = job.attrs.data;
        const event = await Event.findById(eventId);
        if (!event) {
            console.error(
                `Couldn't find event ${eventId}. Couldn't update cheapest ticket.`
            );
            return;
        }
        const { cheapestTicket } = await updateCheapestTicket(event);
        if (!event) {
            console.error(
                `Failed to find event ${eventId} or update its cheapest ticket.`
            );
            return;
        }
        for (const index in event.subscriptionIds) {
            const subscriptionId = event.subscriptionIds[index];
            const subscription = await Subscription.findById(subscriptionId);
            if (!subscription) {
                console.error(
                    `Subscription ${subscriptionId} not found for event ${eventId}`
                );
                continue;
            }
            if (cheapestTicket.price > subscription.price) continue;
            // maybe isolate some of this at some point
            if (subscription.phone) {
                await sendText(
                    `+${subscription.phone}`,
                    `Ticketmaster Price Watcher: A new ticket for ${event.name} in ${cheapestTicket.seat} is listed for ${cheapestTicket.price}. Purchase here: ${event.url}.`
                );
            }
            if (subscription.email)
                await sendEmail(
                    subscription.email,
                    `${event.name} Price Alert`,
                    `Ticketmaster Price Watcher: A new ticket for ${event.name} in ${cheapestTicket.seat} is listed for ${cheapestTicket.price}. Purchase here: ${event.url}.`
                );
        }
    });
}
