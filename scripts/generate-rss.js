import fs from 'fs';
import path from 'path';

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

const items = files.map(file => {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: md } = parseFrontmatter(content);
  const slug = (data.slug && data.slug !== '') ? data.slug : file.replace(/\.md$/, '');
  const url = `${SITE_URL}/blog/${slug}`;
  const title = data.title || slug;
  const description = data.description || '';
  const date = data.published_date || new Date().toISOString();
  const author = data.author || '';
  return { title, description, url, date, author };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

const rssItems = items.map(i => `  <item>\n    <title><![CDATA[${i.title}]]></title>\n    <link>${i.url}</link>\n    <description><![CDATA[${i.description}]]></description>\n    <pubDate>${new Date(i.date).toUTCString()}</pubDate>\n  </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<rss version="2.0">\n<channel>\n  <title>DocScale Blog</title>\n  <link>${SITE_URL}/blog</link>\n  <description>Latest posts from DocScale</description>\n${rssItems}\n</channel>\n</rss>`;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'rss.xml'), rss, 'utf8');
console.log('Generated public/rss.xml');

// Also write to dist if it exists (since this runs postbuild)
const DIST_DIR = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(DIST_DIR)) {
  fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), rss, 'utf8');
  console.log('Generated dist/rss.xml');
}
