import yaml from 'js-yaml';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  published_date: string;
  author: string;
  featuredImage: string;
  content: string;
  excerpt: string;
}



// Robust frontmatter parser using js-yaml
function parseFrontmatter(content: string) {
  const match = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/);
  if (match) {
    try {
      const frontmatter = yaml.load(match[1]) as Record<string, any>;
      return {
        data: frontmatter,
        content: match[2].trim()
      };
    } catch (e) {
      console.error('Error parsing frontmatter:', e);
    }
  }

  return {
    data: {},
    content: content
  };
}


// Vite's import.meta.glob for dynamic blog loading
const blogFiles = import.meta.glob('/blogs/*.md', { query: '?raw', import: 'default', eager: true });

function getSlugFromPath(path: string): string {
  // '/blogs/5-seo-basics-every-clinic-in-india-needs-to-know.md' => '5-seo-basics-every-clinic-in-india-needs-to-know'
  return path.split('/').pop()?.replace(/\.md$/, '') || '';
}

export function getAllPosts(): BlogPost[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the beginning of the day

  return Object.entries(blogFiles).map(([path, content]) => {
    const slug = getSlugFromPath(path);
    const { data, content: markdownContent } = parseFrontmatter(content as string);
    const postDate = new Date(data.published_date);

    // Basic validation for date
    if (isNaN(postDate.getTime())) {
      console.warn(`Invalid date format for post: ${slug}`);
      return null;
    }

    // Remove featured image from content before generating excerpt
    const contentWithoutImage = markdownContent.replace(/^![\[\]^]*\([^)]*\)\s*/, '');
    const words = contentWithoutImage.trim().split(/\s+/);
    const excerpt = words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');

    return {
      slug,
      title: data.title,
      description: data.description,
      published_date: data.published_date,
      author: data.author,
      featuredImage: data.featuredImage,
      content: markdownContent,
      excerpt,
      postDate // For filtering
    };
  })
    .filter((post): post is BlogPost & { postDate: Date } => {
      if (!post) return false;
      // Compare dates without time component
      const postDate = new Date(post.published_date);
      postDate.setHours(0, 0, 0, 0);
      return postDate <= today;
    })
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const entry = Object.entries(blogFiles).find(([path]) => getSlugFromPath(path) === slug);
  if (!entry) return null;

  const [path, content] = entry;
  const { data, content: markdownContent } = parseFrontmatter(content as string);

  const postDate = new Date(data.published_date);
  postDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (postDate > today) {
    return null; // Post is not published yet
  }

  // Remove featured image from content before generating excerpt
  const contentWithoutImage = markdownContent.replace(/^![\[\]^]*\([^)]*\)\s*/, '');
  const words = contentWithoutImage.trim().split(/\s+/);
  const excerpt = words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');

  return {
    slug,
    title: data.title,
    description: data.description,
    published_date: data.published_date,
    author: data.author,
    featuredImage: data.featuredImage,
    content: markdownContent,
    excerpt
  };
}