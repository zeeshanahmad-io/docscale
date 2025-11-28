# 📈 DocScale Growth Playbook (Internal)

**Warning:** This document contains the "Secret Sauce" for DocScale's marketing and growth engineering. Do not share publicly.

---

## 1. The "Chameleon" Hack (Dynamic Demo)

**Goal:** Close deals by showing, not telling. Instead of sending a generic portfolio, send a *personalized* website that looks 100% finished.

### How It Works
The `/demo/preview` route is a "shapeshifter". It reads URL parameters to dynamically inject content, images, and color themes.

### URL Parameters (The Controls)
Customize the demo by appending these parameters to the URL:

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `name` | Doctor or Clinic Name | `Dr. Aditi Sharma` |
| `specialty` | Triggers content & theme | `cardiologist` |
| `city` | Updates location text | `Mumbai` |
| `phone` | Updates contact buttons | `+91 98765 43210` |
| `location` | Full address string | `Bandra West, Mumbai` |

### Supported Specialties (Themes)
Each specialty triggers a unique color palette (Hex codes) and image set:

*   **Dentist**: Deep Teal (`#134e4a`) + Dental Images
*   **Cardiologist**: Deep Burgundy (`#881337`) + Heart Care Images
*   **Dermatologist**: Deep Pink (`#831843`) + Skincare Images
*   **Neurologist**: Deep Indigo (`#312e81`) + Brain Care Images
*   **Wellness Clinic**: Forest Green (`#064e3b`) + Spa/Yoga Images
*   **Orthopedic**: Slate Blue (`#0f172a`) + Bone/Joint Images
*   **Pediatrician**: Burnt Orange (`#7c2d12`) + Child Care Images

### The "Sniper" Outreach Strategy
1.  **Find Targets (Automated)**:
    *   Run the scraper: `node scripts/scrape-leads.js "Dentist in Bandra"`
    *   It finds clinics with **No Website** or **Low Ratings** (< 3.5) and saves them to `src/data/leads.json`.
    *   It also checks for **Broken Links** (404s).
2.  **Manage Leads**:
    *   Go to `/tools/lead-manager`.
    *   Filter by name/address.
    *   Click **"Generate Demo"** to create a personalized link instantly.
3.  **Send the Pitch**:
    *   Click **"Draft Email"** in the Lead Manager.
    *   Choose a template ("Broken Link" or "Low Rating").
    *   Copy & Send.
4.  **The Hook**: The demo has a floating "Live Demo for [Name]" banner with a "Claim This Site" button.

---

## 2. Programmatic SEO (The 1200-Page Engine)

**Goal:** Dominate Google for "Long-Tail" keywords (e.g., "Digital Marketing for Cardiologists in Mysore") without writing 1200 individual pages.

### The Architecture
*   **Data Source**: `src/data/programmaticData.json` contains:
    *   25 Specialties (Cardiologist, Dentist, etc.)
    *   48 Cities (Tier-1, Tier-2, Tier-3)
*   **Multiplier**: 25 x 48 = **1,200 Unique Landing Pages**.
*   **Template**: `src/pages/IndustryPage.tsx` renders the content.

### Anti-Spam Measures (Quality Control)
To prevent Google from flagging this as "Doorway Pages" or spam:
1.  **Deterministic Content Rotation**: We use a hash of the City+Specialty to rotate between 5 different headlines, intros, and CTAs.
2.  **Dynamic FAQs**: The FAQ section is context-aware.
    *   *Q: "How much does marketing cost in [City]?"*
    *   *A: "Marketing in [City] is competitive..."*
3.  **Prerendering**: We use `scripts/prerender.js` to build these as **Static HTML** files at build time. This ensures they load instantly and are easily indexed.

### How to Expand
1.  Open `src/data/programmaticData.json`.
2.  Add a new City or Specialty to the list.
3.  Run `npm run build`.
4.  The system automatically generates the new pages and updates `sitemap.xml`.

---

## 3. The "Clinic SEO Auditor" (Lead Magnet)

**Goal:** Capture email addresses by offering immediate value.

*   **URL**: `/tools/seo-auditor`
*   **Mechanism**:
    *   User enters URL.
    *   We run a client-side check (simulated for speed, or via API).
    *   We generate a PDF report (`SeoReportPdf.tsx`).
*   **Strategy**: Share this tool in medical Facebook groups or LinkedIn communities. "Free Website Health Check for Doctors".

---

## 4. Internal Tools Access (Secret Admin Area)

**Goal:** Provide easy access to internal tools (Lead Manager, Demo Generator) without exposing them to the public or cluttering the UI.

### Access Methods
1.  **Dashboard URL**: `/tools` (Protected by password).
2.  **Keyboard Shortcut**: Press `Ctrl + Shift + L` (or `Cmd + Shift + L` on Mac) anywhere on the site.
3.  **Secret Footer Link**: Click the copyright text **"© 2025 DocScale"** in the footer.

### Available Tools
*   **Lead Manager**: `/tools/lead-manager` - Manage leads and outreach.
*   **Demo Generator**: `/tools/demo-generator` - Create instant demos.
*   **SEO Auditor**: `/tools/seo-auditor` - Run audits.

---

**Keep this playbook updated as we add new growth hacks.**
