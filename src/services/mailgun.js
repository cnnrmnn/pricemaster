import axios from 'axios';

export async function sendEmail(to, subject, text) {
    const endpoint = `${process.env.MAILGUN_BASE_URL}/${process.env.MAILGUN_DOMAIN}/messages`;
    try {
        await axios.post(endpoint, {
            data: {
                from: process.env.MAILGUN_EMAIL,
                to,
                subject,
                text,
            },
        });
    } catch (err) {
        console.error(`Failed to send email ${subject} to ${to}`);
        console.error(err);
    }
}
