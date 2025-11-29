import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

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

// Helper to extract specialty from query
const extractSpecialtyFromQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('dent')) return 'Dentist';
    if (lowerQuery.includes('skin') || lowerQuery.includes('derma')) return 'Dermatologist';
    if (lowerQuery.includes('eye') || lowerQuery.includes('ophthal')) return 'Ophthalmologist';
    if (lowerQuery.includes('ortho')) return 'Orthopedic Surgeon';
    if (lowerQuery.includes('heart') || lowerQuery.includes('cardio')) return 'Cardiologist';
    if (lowerQuery.includes('kidney') || lowerQuery.includes('nephro')) return 'Nephrologist';
    if (lowerQuery.includes('neuro')) return 'Neurologist';
    if (lowerQuery.includes('woman') || lowerQuery.includes('gyn')) return 'Gynecologist';
    if (lowerQuery.includes('child') || lowerQuery.includes('pedia')) return 'Pediatrician';
    if (lowerQuery.includes('physio')) return 'Physiotherapist';
    if (lowerQuery.includes('mind') || lowerQuery.includes('psych')) return 'Psychiatrist';
    if (lowerQuery.includes('ent') || lowerQuery.includes('ear')) return 'ENT Specialist';
    if (lowerQuery.includes('physician') || lowerQuery.includes('general')) return 'General Physician';
    if (lowerQuery.includes('wellness')) return 'Wellness Clinic';
    return null; // Let LeadManager infer if not found in query
};

async function scrapeLeads() {
    console.log(`🔍 Searching for: "${SEARCH_QUERY}"...`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Forward browser logs to Node.js console
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

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

        // Hover over the first item to trigger any dynamic buttons
        try {
            await page.hover('div[role="article"]');
            await new Promise(r => setTimeout(r, 1000)); // Wait for render
        } catch (e) {
            console.log("Could not hover:", e);
        }

        // Extract data by clicking each item
        console.log("⛏️ Extracting data (Clicking each item)...");

        // Get list items handles
        const itemHandles = await page.$$('div[role="article"]');
        const leads = [];

        for (const itemHandle of itemHandles) {
            try {
                // Scroll into view
                await itemHandle.evaluate(el => el.scrollIntoView());

                // Click to load details
                await itemHandle.click();

                // Wait for details panel to load (look for website button or heading)
                // We wait a bit for the panel to update. 
                // A good indicator is the heading matching the item name, but simple wait is safer for now.
                // Wait for details panel to load
                // We wait for the main heading (h1) which indicates the panel has content
                try {
                    await page.waitForSelector('div[role="main"]', { timeout: 3000 });
                    await new Promise(r => setTimeout(r, 1000)); // Extra buffer for dynamic buttons
                } catch (e) {
                    // console.log("Wait for panel failed, continuing...");
                }

                // Extract data from the LIST ITEM (Name, Rating, Address, Phone usually here)
                const listData = await itemHandle.evaluate(item => {
                    const ariaLabel = item.getAttribute('aria-label') || '';
                    const text = item.innerText;
                    const lines = text.split('\n');

                    const name = ariaLabel || lines[0];
                    const ratingText = item.querySelector('span[role="img"]')?.getAttribute('aria-label');
                    const ratingMatch = ratingText ? ratingText.match(/([0-9.]+) stars/) : null;
                    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

                    // Address/Phone from list (fallback)
                    const address = lines[2] || lines.find(l => l.includes(',') && !l.match(/\d{5}/)) || "";
                    const phoneLine = lines.find(l => l.match(/(?:\+91|0)?[ -]?\d{3,4}[ -]?\d{3,4}/) && !l.includes('Open') && !l.includes('Closed'));
                    const phone = phoneLine ? phoneLine.match(/[\d\s+-]{8,}/)?.[0]?.trim() : "";

                    return { name, rating, address, phone };
                });

                // Extract Website from DETAILS PANEL (Global Scope)
                const website = await page.evaluate(() => {
                    // Look for website button in the details panel
                    // Common selectors: data-item-id="authority", aria-label="Website", data-tooltip="Website"
                    const websiteBtn = document.querySelector('a[data-item-id="authority"]') ||
                        document.querySelector('a[aria-label*="Website"]') ||
                        document.querySelector('a[data-tooltip="Website"]');

                    if (websiteBtn) return websiteBtn.href;

                    // Fallback: Look for any external link in the details panel container (usually role="main")
                    // This is risky as it might pick up ads or other links, so we stick to specific buttons first.
                    return null;
                });

                leads.push({ ...listData, website });

            } catch (e) {
                console.log("Error processing item:", e.message);
            }
        }

        // Check for broken links (Post-processing)
        console.log("🔗 Checking for broken links...");
        for (let lead of leads) {
            if (lead.website) {
                const isBroken = await checkWebsiteBroken(lead.website);
                if (isBroken) {
                    lead.note = "Broken Link";
                    console.log(`⚠️ Broken link found for: ${lead.name}`);
                }
            }
        }

        console.log(`📦 Extracted ${leads.length} raw leads.`);

        // Filter qualified leads (Low Rating OR No Website OR Broken Link)
        const querySpecialty = extractSpecialtyFromQuery(SEARCH_QUERY);

        const qualifiedLeads = leads.filter(l => {
            const isLowRating = l.rating > 0 && l.rating < 3.5;
            const isNoWebsite = !l.website;
            const isBrokenLink = l.note === "Broken Link";

            if (isLowRating) console.log(`   🎯 Qualified (Low Rating ${l.rating}): ${l.name}`);
            if (isNoWebsite) console.log(`   🎯 Qualified (No Website): ${l.name}`);
            if (isBrokenLink) console.log(`   🎯 Qualified (Broken Link): ${l.name}`);

            return isLowRating || isNoWebsite || isBrokenLink;
        }).map(l => ({
            ...l,
            city: detectCity(l.address),
            specialty: querySpecialty // Tag with query-based specialty
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
                    city: l.city,
                    note: l.note,
                    specialty: l.specialty,
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
        const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

        try {
            const response = await fetch(url, {
                method: 'HEAD',
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            clearTimeout(timeoutId);

            // If Method Not Allowed (405), try GET
            if (response.status === 405) {
                throw new Error("HEAD not allowed");
            }

            if (response.status >= 400) {
                // Aggressive check: Fail on ANY error >= 400 (including 403/401)
                console.log(`   ❌ Broken (Status ${response.status}): ${url}`);
                return true;
            }
            // console.log(`   ✅ Working (${response.status}): ${url}`);
            return false;

        } catch (e) {
            // Fallback to GET request if HEAD fails
            console.log(`   ⚠️ HEAD failed, trying GET for: ${url}`);
            const controllerGet = new AbortController();
            const timeoutIdGet = setTimeout(() => controllerGet.abort(), 8000);

            const response = await fetch(url, {
                method: 'GET',
                signal: controllerGet.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            clearTimeout(timeoutIdGet);

            if (response.status >= 400) {
                // Aggressive check: Fail on ANY error >= 400 (including 403/401)
                console.log(`   ❌ Broken (Status ${response.status}): ${url}`);
                return true;
            }
            // console.log(`   ✅ Working (${response.status}): ${url}`);
            return false;
        }
    } catch (error) {
        console.log(`   ❌ Broken (Error: ${error.message}): ${url}`);
        return true;
    }
}

scrapeLeads();
