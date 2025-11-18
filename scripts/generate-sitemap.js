import fs from 'fs';
import path from 'path';

// Simple frontmatter parser to avoid extra deps
function parseFrontmatter(content) {
  const match = /^---\s*([\s\S]*?)\s*---/m.exec(content);
  const data = {};
  if (!match) return { data, content };
  const fm = match[1];
  fm.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    data[key] = value;
  });
  const markdown = content.slice(match[0].length).trim();
  return { data, content: markdown };
}

const BLOG_DIR = path.resolve(process.cwd(), 'blogs');
const OUT_DIR = path.resolve(process.cwd(), 'public');
const SITE_URL = process.env.SITE_URL || 'https://docscale.in';

if (!fs.existsSync(BLOG_DIR)) {
  console.error('blogs directory not found:', BLOG_DIR);
  process.exit(1);
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

const urls = [];

files.forEach(file => {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data } = parseFrontmatter(content);
  const slug = (data.slug && data.slug !== '') ? data.slug : file.replace(/\.md$/, '');
  const loc = `${SITE_URL}/blog/${slug}`;
  const lastmod = data.published_date || new Date().toISOString();
  urls.push({ loc, lastmod });
});

// add root and blog index
urls.push({ loc: `${SITE_URL}/`, lastmod: new Date().toISOString() });
urls.push({ loc: `${SITE_URL}/blog`, lastmod: new Date().toISOString() });

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n  </url>`).join('\n') +
  `\n</urlset>`;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml, 'utf8');
console.log('Generated public/sitemap.xml');
