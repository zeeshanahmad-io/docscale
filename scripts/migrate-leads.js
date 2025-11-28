import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase URL or Key in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log("🚀 Starting migration...");

    // Read leads.json
    const leadsPath = path.resolve(__dirname, '../src/data/leads.json');
    if (!fs.existsSync(leadsPath)) {
        console.error("❌ leads.json not found!");
        process.exit(1);
    }

    const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    console.log(`📦 Found ${leads.length} leads in JSON.`);

    // Read localStorage data (simulated merge since we can't access browser LS here)
    // We will just upload the JSON data. The user might lose some "browser-only" status tags 
    // unless they manually update them, but the core data will be safe.

    // Transform for DB
    const records = leads.map(lead => ({
        name: lead.name,
        rating: lead.rating,
        address: lead.address,
        website: lead.website,
        phone: lead.phone,
        city: lead.city || lead.address.split(',').pop()?.trim() || 'Unknown', // Fallback logic
        status: lead.status || 'New',
        note: lead.note
    }));

    // Upsert to Supabase
    const { data, error } = await supabase
        .from('leads')
        .upsert(records, { onConflict: 'name', ignoreDuplicates: true })
        .select();

    if (error) {
        console.error("❌ Migration failed:", error);
    } else {
        console.log(`✅ Successfully uploaded leads!`);
    }
}

migrate();
