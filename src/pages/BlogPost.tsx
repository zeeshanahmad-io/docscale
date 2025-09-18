import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface BlogPostContent {
  id: number;
  title: string;
  slug: string;
  featuredImage?: {
    url: string;
    // Add other properties if you need them, e.g., name, alternativeText
  };
  publishedDate: string;
  author: string;
  body: any[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`
        );
        console.log("BlogPost API Response:", response.data);
        console.log("BlogPost data array:", response.data.data);
        if (response.data.data.length > 0) {
          setPost(response.data.data[0]);
          console.log("Post set to:", response.data.data[0]);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        setError('Failed to fetch blog post. Please check your Strapi backend URL and network connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="container-width py-24 text-center">Loading blog post...</div>;
  }

  if (error) {
    return <div className="container-width py-24 text-center text-red-500">Error: {error}</div>;
  }

  if (!post) {
    return <div className="container-width py-24 text-center">Blog post not found.</div>;
  }

  const convertStrapiBodyToMarkdown = (bodyContent: any[]): string => {
    if (!bodyContent || bodyContent.length === 0) return "";

    let markdownString = "";
    bodyContent.forEach(block => {
      if (block.type === 'heading') {
        const level = block.level;
        const text = block.children.map((child: any) => child.text).join("");
        markdownString += `${'#'.repeat(level)} ${text}\n\n`;
      } else if (block.type === 'paragraph') {
        const text = block.children.map((child: any) => child.text).join("");
        markdownString += `${text}\n\n`;
      } else if (block.type === 'list') {
        block.children.forEach((listItem: any) => {
          const text = listItem.children.map((child: any) => child.text).join("");
          markdownString += `- ${text}\n`;
        });
        markdownString += "\n";
      }
      // Add more block types as needed (e.g., image, quote, code)
    });
    return markdownString;
  };

  const markdownBody = convertStrapiBodyToMarkdown(post.body);

  return (
    <div className="container-width py-24">
      <article className="max-w-3xl mx-auto">
        {post.featuredImage?.url && (
          <img 
            src={`http://localhost:1337${post.featuredImage.url}`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-lg text-muted-foreground mb-8">
          By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{markdownBody}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;