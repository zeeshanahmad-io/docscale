import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const BLOG_DIR = path.resolve(process.cwd(), 'blogs');
const DIST_DIR = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SITE_URL = 'https://docscale.in';

// Helper to parse frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/);
    if (match) {
        try {
            const frontmatter = yaml.load(match[1]);
            return { frontmatter, content: match[2] };
        } catch (e) {
            console.error("Error parsing frontmatter:", e);
        }
    }
    return { frontmatter: {}, content };
}

async function prerender() {
    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error('dist/index.html not found. Run build first.');
        process.exit(1);
    }

    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    if (!fs.existsSync(BLOG_DIR)) {
        console.log('No blogs directory found.');
        return;
    }

    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

    console.log(`Found ${files.length} blog posts to prerender...`);

    for (const file of files) {
        const filePath = path.join(BLOG_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter } = parseFrontmatter(content);

        // Determine slug
        const slug = file.replace(/\.md$/, '');

        // Prepare metadata
        const title = frontmatter.title || 'Blog Post';
        const description = frontmatter.description || 'Read this article on DocScale.';
        const image = frontmatter.featuredImage
            ? (frontmatter.featuredImage.startsWith('http') ? frontmatter.featuredImage : `${SITE_URL}${frontmatter.featuredImage}`)
            : `${SITE_URL}/images/hero-doctor-patient.jpg`;
        const url = `${SITE_URL}/blog/${slug}`;

        // Create output directory
        const outDir = path.join(DIST_DIR, 'blog', slug);
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        // Inject metadata into template
        let html = template;

        // Title
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title} | DocScale</title>`);
        html = html.replace(/<meta property="og:title"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${title} | DocScale" />`);
        html = html.replace(/<meta name="twitter:title"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:title" content="${title} | DocScale" />`);

        // Description
        html = html.replace(/<meta name="description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
        html = html.replace(/<meta property="og:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
        html = html.replace(/<meta name="twitter:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);

        // Image
        html = html.replace(/<meta property="og:image"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:image" content="${image}" />`);
        html = html.replace(/<meta name="twitter:image"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:image" content="${image}" />`);

        // URL / Canonical
        html = html.replace(/<link rel="canonical"[\s\S]*?href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
        html = html.replace(/<meta property="og:url"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);

        // Write file
        fs.writeFileSync(path.join(outDir, 'index.html'), html);
        console.log(`Prerendered: blog/${slug}`);
    }

    // Programmatic SEO Pages
    const PROGRAMMATIC_DATA_PATH = path.resolve(process.cwd(), 'src/data/programmaticData.json');
    if (fs.existsSync(PROGRAMMATIC_DATA_PATH)) {
        const data = JSON.parse(fs.readFileSync(PROGRAMMATIC_DATA_PATH, 'utf8'));
        console.log(`Found ${data.specialties.length} specialties and ${data.cities.length} cities. Generating ${data.specialties.length * data.cities.length} landing pages...`);

        for (const specialty of data.specialties) {
            for (const city of data.cities) {
                const urlPath = `marketing-for-${specialty.id}-in-${city.id}`;
                const title = `Digital Marketing for ${specialty.plural} in ${city.label} | DocScale`;
                const description = `Attract more patients to your ${specialty.label} practice in ${city.label}. Expert SEO, Google Ads, and Website Design tailored for ${specialty.plural}.`;
                const url = `${SITE_URL}/${urlPath}`;

                // Create output directory
                const outDir = path.join(DIST_DIR, urlPath);
                if (!fs.existsSync(outDir)) {
                    fs.mkdirSync(outDir, { recursive: true });
                }

                let html = template;

                // Title
                html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
                html = html.replace(/<meta property="og:title"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
                html = html.replace(/<meta name="twitter:title"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);

                // Description
                html = html.replace(/<meta name="description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
                html = html.replace(/<meta property="og:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
                html = html.replace(/<meta name="twitter:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);

                // URL / Canonical
                html = html.replace(/<link rel="canonical"[\s\S]*?href="[\s\S]*?"\s*\/?>/i, `<link rel="canonical" href="${url}" />`);
                html = html.replace(/<meta property="og:url"[\s\S]*?content="[\s\S]*?"\s*\/?>/i, `<meta property="og:url" content="${url}" />`);

                fs.writeFileSync(path.join(outDir, 'index.html'), html);
            }
        }
        console.log('Programmatic SEO pages generated.');
    }
}

prerender();
