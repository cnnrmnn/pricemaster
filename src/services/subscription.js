import { Event } from '../models/event';
import { Subscription } from '../models/subscription';
import { updateEventInfo } from './ticketmaster';

export async function createSubscription(body) {
    let subscription;
    try {
        subscription = await Subscription.create(body);
        await updateEventInfo(subscription.eventId, subscription._id);
    } catch (err) {
        console.error(`Failed to create subscription`);
        console.error(err);
    }
    return subscription;
}

export async function updateSubscription(subscriptionId, body) {
    let subscription;
    try {
        subscription = await Subscription.findByIdAndUpdate(
            subscriptionId,
            body,
            { new: true }
        );
    } catch (err) {
        console.error(`Failed to update subscription ${subscriptionId}`);
        console.error(err);
    }
    return subscription;
}

export async function deleteSubscription(subscriptionId) {
    let subscription;
    try {
        subscription = await Subscription.findByIdAndDelete(subscriptionId);
    } catch (err) {
        console.error(`Failed to delete subscription ${subscriptionId}`);
        console.error(err);
    }
    if (!subscription) return;
    try {
        await Event.findByIdAndUpdate(subscription.eventId, {
            $pull: { subscriptionIds: subscriptionId },
        });
    } catch (err) {
        console.error(
            `Failed to remove subscription ${subscriptionId} from event ${subscription.eventId}`
        );
        console.error(err);
    }
    return subscription;
}
