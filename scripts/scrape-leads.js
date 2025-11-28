import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase URL or Key. Run with --env-file=.env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEARCH_QUERY = process.argv[2] || 'Dentist in Bandra';

// Helper to detect city from address
const detectCity = (address) => {
    const cityMappings = {
        // Mumbai Areas
        "Bandra": "Mumbai", "Andheri": "Mumbai", "Juhu": "Mumbai", "Powai": "Mumbai",
        "Worli": "Mumbai", "Colaba": "Mumbai", "Dadar": "Mumbai", "Thane": "Mumbai",
        "Navi Mumbai": "Mumbai", "Mumbai": "Mumbai",

        // Bangalore Areas
        "Indiranagar": "Bangalore", "Koramangala": "Bangalore", "Whitefield": "Bangalore",
        "HSR Layout": "Bangalore", "Bellandur": "Bangalore", "Jayanagar": "Bangalore",
        "Malleswaram": "Bangalore", "Yelahanka": "Bangalore", "Hebbal": "Bangalore",
        "Bengaluru": "Bangalore", "Bangalore": "Bangalore",

        // Other Major Cities
        "Delhi": "Delhi", "New Delhi": "Delhi",
        "Pune": "Pune", "Hyderabad": "Hyderabad", "Chennai": "Chennai",
        "Kolkata": "Kolkata", "Ahmedabad": "Ahmedabad"
    };

    for (const [key, city] of Object.entries(cityMappings)) {
        if (address.toLowerCase().includes(key.toLowerCase())) {
            return city;
        }
    }
    return "Unknown";
};

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
        const leads = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('div[role="article"]'));

            return items.map(item => {
                const ariaLabel = item.getAttribute('aria-label') || '';
                const text = item.innerText;
                const lines = text.split('\n');

                // Heuristic extraction
                const name = ariaLabel || lines[0];
                const ratingText = item.querySelector('span[role="img"]')?.getAttribute('aria-label');
                const ratingMatch = ratingText ? ratingText.match(/([0-9.]+) stars/) : null;
                const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

                // Find website link
                const links = Array.from(item.querySelectorAll('a'));
                const websiteLink = links.find(a => a.href && !a.href.includes('google.com/maps') && !a.href.includes('google.com/search'));
                const website = websiteLink ? websiteLink.href : null;

                // Find address and phone (simple heuristics)
                const address = lines[2] || lines.find(l => l.includes(',') && !l.match(/\d{5}/)) || "";
                const phone = lines.find(l => l.match(/\+?\d[\d\s-]{7,}\d/)) || "";

                return { name, rating, address, website, phone };
            });
        });

        console.log(`📦 Extracted ${leads.length} raw leads.`);

        // Filter qualified leads (Rating < 4.5 OR No Website)
        const qualifiedLeads = leads.filter(l => (l.rating > 0 && l.rating < 4.5) || !l.website).map(l => ({
            ...l,
            city: detectCity(l.address)
        }));

        console.log(`🎯 Found ${qualifiedLeads.length} qualified leads (Low Rating or No Website).`);

        if (qualifiedLeads.length > 0) {
            // Upsert to Supabase
            const { data, error } = await supabase
                .from('leads')
                .upsert(qualifiedLeads.map(l => ({
                    name: l.name,
                    rating: l.rating,
                    address: l.address,
                    website: l.website,
                    phone: l.phone,
                    city: l.city,
                    status: 'New'
                })), { onConflict: 'name', ignoreDuplicates: true });

            if (error) {
                console.error("❌ Failed to save leads to Supabase:", error);
            } else {
                console.log(`✅ Successfully saved qualified leads to database!`);
            }
        } else {
            console.log("⚠️ No qualified leads found to save.");
        }

    } catch (error) {
        console.error("❌ Error during scraping:", error);
    } finally {
        await browser.close();
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        const wrapper = document.querySelector('div[role="feed"]');
        if (!wrapper) return;

        await new Promise((resolve) => {
            let totalHeight = 0;
            let distance = 1000;
            let attempts = 0;
            let timer = setInterval(() => {
                let scrollHeight = wrapper.scrollHeight;
                wrapper.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    attempts++;
                    if (attempts > 5) {
                        clearInterval(timer);
                        resolve();
                    }
                } else {
                    attempts = 0;
                }
            }, 500);
        });
    });
}

async function checkWebsiteBroken(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        clearTimeout(timeoutId);

        return response.status >= 400;
    } catch (error) {
        return true;
    }
}

scrapeLeads();
