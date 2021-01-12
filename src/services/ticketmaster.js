import axios from "axios";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

async function getEvent(eventId) {
    const eventEndpoint = `${process.env.TM_BASE_URL}/events/${eventId}.json?apikey=${process.env.TM_API_KEY}`;
    const { data } = await axios.get(eventEndpoint);
    return data;
}

async function getEventURL(eventId) {
    const { url } = await getEvent(eventId); 
    console.log(url);
    return url;
}

async function getCheapestTicket(eventId) {
    let seat, price;
    const eventURL = await getEventURL(eventId);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(eventURL);
    await page.waitForTimeout(5000);
    try {
        seat = await page.evaluate(() => document.querySelector('.quick-picks__item-desc').innerText);
        price = await page.evaluate(() => document.querySelector('[id*="quickpick-buy-button-qp"]').children.item(0).children.item(0).innerText);
    } catch (err) {
        console.log("Failed to scrape ticket information.");
    }
    await browser.close();
    return { seat, price };
}
