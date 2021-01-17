import axios from 'axios';

export async function sendEmail(to, subject, text) {
    const endpoint = `${process.env.MAILGUN_BASE_URL}/${process.env.MAILGUN_DOMAIN}/messages`;
    await axios.post(endpoint, {
        data: {
            from: process.env.MAILGUN_EMAIL,
            to,
            subject,
            text,
        },
    });
}
