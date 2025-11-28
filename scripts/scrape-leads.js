import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SEARCH_QUERY = process.argv[2] || 'Dentist in Bandra';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/leads.json');

async function scrapeLeads() {
    console.log(`🔍 Searching for: "${SEARCH_QUERY}"...`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to ensure elements are visible
    await page.setViewport({ width: 1280, height: 800 });

    try {
        // Navigate to Google Maps
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(SEARCH_QUERY)}`, {
            waitUntil: 'networkidle2'
        });

        // Wait for results to load
        try {
            await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
        } catch (e) {
            console.log("Could not find feed, trying alternative selector...");
            await page.waitForSelector('div[aria-label^="Results for"]', { timeout: 10000 });
        }

        // Scroll to load more results
        console.log("📜 Scrolling to load more results...");
        await autoScroll(page);

        // Extract data
        console.log("⛏️ Extracting data...");
        const leads = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('div[role="article"]'));

            return items.map(item => {
                const ariaLabel = item.getAttribute('aria-label') || '';
                const text = item.innerText;
                const lines = text.split('\n');

                // Try to find rating
                const ratingElement = item.querySelector('span[role="img"]');
                const ratingLabel = ratingElement ? ratingElement.getAttribute('aria-label') : '';
                const ratingMatch = ratingLabel ? ratingLabel.match(/([0-9.]+) stars/) : null;
                const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

                // Try to find website
                const links = Array.from(item.querySelectorAll('a'));
                const websiteLink = links.find(l => l.href && !l.href.includes('google.com/maps') && !l.href.includes('google.com/search'));
                const website = websiteLink ? websiteLink.href : null;

                return {
                    name: ariaLabel,
                    rating: rating,
                    address: lines[2] || '', // Rough heuristic
                    website: website,
                    phone: lines.find(l => l.match(/\+91|0\d+/)) || '', // Rough heuristic for India
                    status: 'New'
                };
            });
        });

        // Filter leads: No website OR Low rating (< 3.5)
        const qualifiedLeads = leads.filter(lead => !lead.website || lead.rating < 3.5);

        console.log(`✅ Found ${leads.length} total results.`);
        console.log(`🎯 Qualified ${qualifiedLeads.length} leads (No website or Rating < 3.5).`);

        // Read existing leads to append/merge
        let existingLeads = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            existingLeads = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        }

        // Merge (avoid duplicates by name)
        const allLeads = [...existingLeads];
        qualifiedLeads.forEach(newLead => {
            if (!allLeads.find(l => l.name === newLead.name)) {
                allLeads.push(newLead);
            }
        });

        // Save
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allLeads, null, 2));
        console.log(`💾 Saved ${allLeads.length} leads to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ Error scraping:', error);
    } finally {
        await browser.close();
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');
        if (!wrapper) return;

        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 1000;
            var timer = setInterval(() => {
                var scrollHeight = wrapper.scrollHeight;
                wrapper.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}

scrapeLeads();
