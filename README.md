# pricemaster

**pricemaster** sends you SMS and/or email notifications when the cheapest ticket for an event on Ticketmaster meets your price criteria.

Ticketmaster doesn't have a feature that does this. Refreshing my browser every 5 minutes while trying to get cheap Bucs tickets annoyed me, so I decided to build this.

## How it works

**pricemaster** is implemented as an express web server with MongoDB.

Ticketmaster's public API doesn't expose any ticket data, so I only use it to get general event data. Ticket prices and seat info are scraped using puppeteer. Since ticket data is scraped using CSS classes/IDs, the app could break if Ticketmaster changes their front-end. I will try to keep this maintained.

Twilio is used for SMS, and Mailgun is used for email.

I'm not currently hosting this anywhere, but anyone is welcome to do so if they'd like. **pricemaster** is definitely not built for scale and it likely wouldn't work at great scale given the scarcity of cheap tickets. I didn't build much error checking into **pricemaster**, so use with caution.
