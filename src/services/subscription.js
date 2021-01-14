import { Event } from '../models/event';
import { Subscription } from '../models/subscription';

export async function deleteSubscription(subscriptionId) {
    const subscription = await Subscription.findByIdAndDelete(subscriptionId);
    if (!subscription) return;
    await Event.findByIdAndUpdate(subscription.eventId, {
        $pull: { subscriptionIds: subscriptionId },
    });
    return subscription;
}
