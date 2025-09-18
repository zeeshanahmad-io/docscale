export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  published_date: string;
  author: string;
  content: string;
  excerpt: string;
}

// Simple frontmatter parser for browser compatibility
function parseFrontmatter(content: string) {
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterData: Record<string, string> = {};
  let markdownContent = '';
  let frontmatterEnd = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      } else {
        frontmatterEnd = i + 1;
        break;
      }
    }
    
    if (inFrontmatter && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      frontmatterData[key.trim()] = value;
    }
  }
  
  markdownContent = lines.slice(frontmatterEnd).join('\n').trim();
  
  return {
    data: frontmatterData,
    content: markdownContent
  };
}

// Static blog posts data
const blogPosts: Record<string, string> = {
  '5-seo-basics-every-clinic-in-india-needs-to-know': `---
title: 5 SEO Basics Every Clinic in India Needs to Know
description: Learn the essential SEO practices to help your clinic rank higher and attract more local patients.
published_date: 2025-09-18
author: DocScale Team
---

A strong online presence is no longer a luxury for clinics; it's a necessity. With millions of Indians turning to Google to find a doctor, optimizing your website for search engines (SEO) is the most powerful way to grow your practice. Here are 5 SEO basics that every clinic in India needs to know.

## 1. Optimize Your Google Business Profile

Your Google Business Profile (formerly Google My Business) is your digital front door. It's the most important factor for local SEO.
* **Complete Your Profile**: Ensure your name, address, and phone number (NAP) are accurate and consistent with your website.
* **Choose the Right Categories**: Don't just select "Doctor." Be specific (e.g., "Dermatology Clinic" or "Pediatrician").
* **Get Reviews**: Encourage happy patients to leave reviews on your profile. Responding to both positive and negative feedback professionally is crucial for building trust.

## 2. Focus on Local Keywords

Patients in India often search for doctors "near me" or in their specific city. Your website content should reflect this.
* **Targeted Keywords**: Use keywords like "cardiologist in Patna" or "best dentist near me in Bangalore" in your website content, especially in your page titles and headings.
* **Create Location-Specific Pages**: If your practice has multiple locations, create a separate page for each one, with unique content and local keywords.

## 3. Create High-Quality, Relevant Content

Content is the foundation of good SEO. By writing about health topics, you establish yourself as an expert and build trust with potential patients.
* **Patient-Focused Blog**: Write blog posts that answer common patient questions. For example, "What to expect during a dental check-up" or "Managing diabetes during Diwali."
* **Showcase Your Services**: Create a detailed service page for each treatment you offer, with clear descriptions and relevant keywords.

## 4. Ensure Your Website is Mobile-Friendly

Most of your potential patients will find your website on a mobile phone. A slow or difficult-to-use mobile site will cause them to leave instantly.
* **Fast Loading Time**: Optimize images and code to ensure your website loads in under 3 seconds.
* **Easy Navigation**: Make sure your "Book an Appointment" and "Call Now" buttons are easy to find and click on a mobile screen.

## 5. Build a Strong Online Reputation

Online reviews are now a major ranking factor for Google. A positive reputation not only boosts your SEO but also gives patients the confidence to choose your clinic.
* **Ask for Reviews**: Politely ask happy patients to leave you a review on Google and other platforms like Practo.
* **Manage Reviews**: Thank patients for positive reviews and professionally address any negative feedback. This shows you are responsive and care about patient experience.`,

  'how-to-get-more-5-star-reviews-on-practo': `---
title: How to Get More 5-Star Reviews on Practo
description: A practical guide for doctors in India to increase their positive reviews and build a stellar reputation on Practo.
published_date: 2025-09-18
author: DocScale Team
---

Practo is the leading platform for finding doctors in India, and your profile is a key part of your online brand. Patients rely heavily on reviews to make a decision, so building a strong reputation is crucial. Here's a step-by-step guide to getting more 5-star reviews on Practo.

## 1. The Proactive Approach: Just Ask

The most effective way to get more reviews is to simply ask for them. After a successful consultation, have your staff send a polite and simple message to the patient.
* **Automate the Request**: Use an automated SMS or WhatsApp message that goes out a few hours after the patient's appointment.
* **Provide a Direct Link**: Make it as easy as possible. Include a direct link to your Practo profile's review section. The less friction, the more likely the patient is to leave a review.

## 2. Optimize Your Practo Profile

A complete and professional profile instills confidence in patients and encourages them to leave positive feedback.
* **Complete Your Profile**: Ensure all your information is accurate, including your qualifications, clinic hours, and services.
* **Add Professional Photos**: A professional headshot and clear photos of your clinic build trust and professionalism.
* **Engage with the Platform**: Share health tips and updates on your Practo profile to show you're an active and engaging practitioner.

## 3. Manage Your Reviews Professionally

What you do after a review is just as important as getting the review itself.
* **Respond to All Reviews**: Thank patients for positive reviews and acknowledge any negative feedback with a professional and empathetic response.
* **Move Negative Conversations Offline**: If a patient leaves a negative review, respond publicly by offering to resolve the issue privately. This shows you care and are taking action without violating patient confidentiality.
* **Stay Professional**: Never argue with a patient online. A calm and professional response can often turn a negative review into a positive brand moment.`,

  'google-ads-vs-seo-which-is-right-for-your-practice': `---
title: Google Ads vs. SEO: Which Is Right for Your Practice?
description: Understand the key differences between Google Ads and SEO to choose the best digital marketing strategy for your clinic.
published_date: 2025-09-18
author: DocScale Team
---

When it comes to digital marketing, doctors in India often ask, "Should I focus on Google Ads or SEO?" The truth is, they are two different strategies that work best together. Here's a simple breakdown to help you decide what's best for your practice.

## What is SEO?

SEO, or Search Engine Optimization, is about earning a high ranking in Google's organic (non-paid) search results.
* **Pros**: It's a long-term investment that provides sustainable, free traffic. Once you rank high, your website can continue to bring in patients for years without you paying per click. It builds trust and authority.
* **Cons**: It takes time—typically 3-6 months to see significant results. It requires a lot of consistent effort.
* **Best For**: Practices focused on building a long-term brand, those who want to reduce marketing costs over time, and clinics that want to become a trusted source of information.

## What are Google Ads?

Google Ads (also known as PPC or Pay-Per-Click) is paid advertising. Your clinic's ad appears at the very top of Google's search results, above the organic results.
* **Pros**: It's an accelerator. You can get immediate visibility and patient leads as soon as your campaign goes live. It's a great way to attract patients for a new clinic or a specific service.
* **Cons**: It's a pay-to-play model. Once you stop paying, your ad disappears. The cost can be high in competitive markets.
* **Best For**: Practices that need immediate patient acquisition, launching a new service, or filling appointments quickly.

## The Verdict: A Balanced Approach

The most effective strategy for most doctors is to use a balanced approach.
* **Use Google Ads to sprint**: Get immediate patient flow and revenue while your SEO strategy builds momentum.
* **Invest in SEO for the long run**: Build a strong, lasting foundation that will eventually reduce your reliance on paid ads.

This dual strategy gives you the best of both worlds: consistent patient flow now, and a strong, sustainable online brand for the future.`
};

export function getAllPosts(): BlogPost[] {
  return Object.entries(blogPosts).map(([slug, content]) => {
    const { data, content: markdownContent } = parseFrontmatter(content);
    const words = markdownContent.trim().split(/\s+/);
    const excerpt = words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');

    return {
      slug,
      title: data.title,
      description: data.description,
      published_date: data.published_date,
      author: data.author,
      content: markdownContent,
      excerpt
    };
  }).sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const content = blogPosts[slug];
  if (!content) return null;

  const { data, content: markdownContent } = parseFrontmatter(content);
  const words = markdownContent.trim().split(/\s+/);
  const excerpt = words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');

  return {
    slug,
    title: data.title,
    description: data.description,
    published_date: data.published_date,
    author: data.author,
    content: markdownContent,
    excerpt
  };
}