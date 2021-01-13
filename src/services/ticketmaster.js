import axios from 'axios';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import { Event } from '../models/event';

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

async function getEvent(eventId) {
    const eventEndpoint = `${process.env.TM_BASE_URL}/events/${eventId}.json?apikey=${process.env.TM_API_KEY}`;
    const { data } = await axios.get(eventEndpoint);
    return data;
}

async function getCheapestTicket(eventUrl) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(eventUrl);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'example.png' });
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
        return { seat, price: parseInt(price.replace(/,/g, '').substring(1)) };
    } catch (err) {
        console.error('Failed to scrape ticket information.');
    }
    await browser.close();
}

export async function updateEventInfo(eventId) {
    const { name, url, dates } = await getEvent(eventId);
    const cheapestTicket = await getCheapestTicket(url);
    try {
        await Event.findByIdAndUpdate(
            eventId,
            { name, url, date: dates.start.dateTime, cheapestTicket },
            { upsert: true }
        );
    } catch (err) {
        console.error(`Failed to update event info for ${eventId}`);
    }
}

export async function updateCheapestTicket(eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
        console.error(
            `Couldn't find event ${eventId}. Couldn't update cheapest ticket.`
        );
        return;
    }
    const cheapestTicket = await getCheapestTicket(event.url);
    event.cheapestTicket = cheapestTicket;
    try {
        await event.save();
        return event;
    } catch (err) {
        console.error(`Failed to update cheapest ticket for event ${eventId}.`);
    }
}
