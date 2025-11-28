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
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(SEARCH_QUERY)}`, {
            waitUntil: 'networkidle2'
        });

        // Wait for feed
        try {
            await page.waitForSelector('div[role="feed"]', { timeout: 10000 });
        } catch (e) {
            console.log("Could not find feed, trying alternative selector...");
            await page.waitForSelector('div[aria-label^="Results for"]', { timeout: 10000 });
        }

        // Scroll aggressively
        console.log("📜 Scrolling to load ALL results (this may take a moment)...");
        await autoScroll(page);

        // Extract raw data
        console.log("⛏️ Extracting data...");
        const rawLeads = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('div[role="article"]'));

            return items.map(item => {
                const ariaLabel = item.getAttribute('aria-label') || '';
                const text = item.innerText;
                const lines = text.split('\n');

                const ratingElement = item.querySelector('span[role="img"]');
                const ratingLabel = ratingElement ? ratingElement.getAttribute('aria-label') : '';
                const ratingMatch = ratingLabel ? ratingLabel.match(/([0-9.]+) stars/) : null;
                const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

                const links = Array.from(item.querySelectorAll('a'));
                const websiteLink = links.find(l => l.href && !l.href.includes('google.com/maps') && !l.href.includes('google.com/search'));
                const website = websiteLink ? websiteLink.href : null;

                return {
                    name: ariaLabel,
                    rating: rating,
                    address: lines[2] || '',
                    website: website,
                    phone: lines.find(l => l.match(/\+91|0\d+/)) || '',
                    city: SEARCH_QUERY.split(' in ')[1] || 'Unknown',
                    status: 'New'
                };
            });
        });

        console.log(`✅ Found ${rawLeads.length} total listings.`);

        // Filter and Validate
        const qualifiedLeads = [];
        console.log("🕵️‍♂️ Validating leads (Checking for broken links & low ratings)...");

        for (const lead of rawLeads) {
            let reason = null;

            // 1. Check Rating
            if (lead.rating > 0 && lead.rating < 3.5) {
                reason = `Low Rating (${lead.rating})`;
            }
            // 2. Check Missing Website
            else if (!lead.website) {
                reason = "No Website";
            }
            // 3. Check Broken Website (if website exists)
            else if (lead.website) {
                process.stdout.write(`   Checking ${lead.website}... `);
                const isBroken = await checkWebsiteBroken(lead.website);
                if (isBroken) {
                    reason = "Broken Website (404/Error)";
                    console.log("❌ BROKEN");
                } else {
                    console.log("✅ OK");
                }
            }

            if (reason) {
                qualifiedLeads.push({ ...lead, note: reason });
            }
        }

        console.log(`🎯 Qualified ${qualifiedLeads.length} leads.`);

        // Merge and Save
        let existingLeads = [];
        if (fs.existsSync(OUTPUT_FILE)) {
            existingLeads = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
        }

        const allLeads = [...existingLeads];
        qualifiedLeads.forEach(newLead => {
            if (!allLeads.find(l => l.name === newLead.name)) {
                allLeads.push(newLead);
            }
        });

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
            var attempts = 0;

            var timer = setInterval(() => {
                var scrollHeight = wrapper.scrollHeight;
                wrapper.scrollBy(0, distance);
                totalHeight += distance;

                // If we reached the bottom, wait a bit to see if more load
                if (totalHeight >= scrollHeight) {
                    attempts++;
                    // Try 5 times to wait for more content (Google Maps lazy loads in chunks)
                    if (attempts > 5) {
                        clearInterval(timer);
                        resolve();
                    }
                } else {
                    attempts = 0; // Reset attempts if we successfully scrolled
                }
            }, 500); // Slower scroll to let network catch up
        });
    });
}

async function checkWebsiteBroken(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' } // Pretend to be a browser
        });
        clearTimeout(timeoutId);

        return response.status >= 400; // 404, 500, etc.
    } catch (error) {
        return true; // DNS error, timeout, network fail = Broken
    }
}

scrapeLeads();
