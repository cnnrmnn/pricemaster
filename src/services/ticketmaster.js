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
        console.log(err);
    }
}

async function getCheapestTicket(eventUrl) {
    let seat, price;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(eventUrl);
    await page.waitForTimeout(5000);
    try {
        seat = await page.evaluate(
            () => document.querySelector('.quick-picks__item-desc').innerText
        );
        price = await page.evaluate(
            () =>
                document
                    .querySelector('[id*="quickpick-buy-button-qp"]')
                    .children.item(0)
                    .children.item(0).innerText
        );
    } catch (err) {
        console.error('Failed to scrape ticket information.');
    }
    await browser.close();
    return { seat, price: parseInt(price.replace(/,/g, '').substring(1)) };
}
