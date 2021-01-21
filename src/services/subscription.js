import { Event } from '../models/event';
import { Subscription } from '../models/subscription';
import { updateEventInfo } from './ticketmaster';

export async function createSubscription(body) {
    const subscription = await Subscription.create(body);
    await updateEventInfo(subscription.eventId, subscription._id);
    return subscription;
}

export async function updateSubscription(subscriptionId, body) {
    const subscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        body,
        { new: true }
    );
    return subscription;
}

export async function deleteSubscription(subscriptionId) {
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription) return;
    await Event.findByIdAndUpdate(subscription.eventId, {
        $pull: { subscriptionIds: subscriptionId },
    });
    return subscription;
}
