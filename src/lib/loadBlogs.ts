import { Mode } from 'vite-plugin-markdown';

// This utility loads all markdown files in /blogs and parses their frontmatter and content.
// It returns an array of blog post objects with metadata and content.

const blogFiles = import.meta.glob('/blogs/*.md', { eager: true });

export interface BlogPostMeta {
  title: string;
  description: string;
  published_date: string;
  author: string;
}

export interface BlogPost {
  slug: string;
  meta: BlogPostMeta;
  html: string;
}

export function getAllBlogs(): BlogPost[] {
  return Object.entries(blogFiles).map(([path, mod]: any) => {
    // Extract slug from file path
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    // vite-plugin-markdown exposes .attributes and .html
    return {
      slug,
      meta: mod.attributes as BlogPostMeta,
      html: mod.html as string,
    };
  }).sort((a, b) => new Date(b.meta.published_date).getTime() - new Date(a.meta.published_date).getTime());
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return getAllBlogs().find((post) => post.slug === slug);
}
