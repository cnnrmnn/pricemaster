import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_KEY_SID,
    process.env.TWILIO_KEY_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

export async function sendText(to, body) {
    try {
        const message = await client.messages.create({
            body,
            to,
            from: process.env.TWILIO_PHONE_NUMBER,
        });
    } catch (err) {
        console.error(`Failed to send text to ${to}`);
        console.error(err);
    }
}
