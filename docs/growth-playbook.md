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
1.  **Find a Target**: Search Google Maps for "Dentist in [City]" with a bad website.
2.  **Generate the Link**: Construct the URL: `docscale.in/demo/preview?name=Dr.[Name]&specialty=dentist&city=[City]`
3.  **Send the Email**:
    > "Hi Dr. [Name], I noticed your website is down. I mocked up a new design for you here: [Link]. It's already built. Want to claim it?"
4.  **The Hook**: The demo has a floating "Live Demo for [Name]" banner with a "Claim This Site" button that links to your contact form.

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

**Keep this playbook updated as we add new growth hacks.**
