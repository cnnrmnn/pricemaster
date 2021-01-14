import twilio from 'twilio';

const client = twilio(
    process.env.TWILIO_KEY_SID,
    process.env.TWILIO_KEY_SECRET,
    { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

export async function sendText(to, body) {
    client.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
    });
}
