import axios from 'axios';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { upsertEvent } from './event';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

async function getEvent(eventId) {
    const eventEndpoint = `${process.env.TM_BASE_URL}/events/${eventId}.json?apikey=${process.env.TM_API_KEY}`;
    const { data } = await axios.get(eventEndpoint);
    return data;
}

async function getCheapestTicket(eventUrl) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(eventUrl);
    await page.waitForNavigation({
        waitUntil: 'networkidle0',
    });
    try {
        const seat = await page.evaluate(
            () => document.querySelector('.quick-picks__item-desc').innerText
        );
        const price = await page.evaluate(
            () =>
                document
                    .querySelector('[id*="quickpick-buy-button-qp"]')
                    .children.item(0)
                    .children.item(0).innerText
        );
        await browser.close();
        return { seat, price: parseInt(price.replace(/,/g, '').substring(1)) };
    } catch (err) {
        await browser.close();
        console.error(`Failed to scrape ticket information on ${eventUrl}`);
        console.error(err);
    }
}

export async function updateEventInfo(eventId, subscriptionId) {
    const { name, url, dates } = await getEvent(eventId);
    try {
        await upsertEvent(eventId, {
            name,
            url,
            date: dates.start.dateTime,
            $push: { subscriptionIds: subscriptionId },
        });
    } catch (err) {
        console.error(`Failed to update event info for ${eventId}`);
        console.error(err);
    }
}

export async function updateCheapestTicket(event) {
    const cheapestTicket = await getCheapestTicket(event.url);
    event.cheapestTicket = cheapestTicket;
    try {
        await event.save();
        return event;
    } catch (err) {
        console.error(
            `Failed to update cheapest ticket for event ${event._id}`
        );
        console.error(err);
    }
}
