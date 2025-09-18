import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  featuredImage: {
    data: {
      attributes: {
        url: string;
      };
    };
  };
  publishedDate: string;
  author: string;
  body: any[];
}

const BlogIndex = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:1337/api/blog-posts?populate=*');
        console.log("Strapi API Response:", response.data);
        console.log("Posts data:", response.data.data);
        setPosts(response.data.data);
      } catch (err) {
        setError('Failed to fetch blog posts. Please check your Strapi backend URL and network connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="container-width py-24 text-center">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="container-width py-24 text-center text-red-500">Error: {error}</div>;
  }

  const getExcerpt = (bodyContent: any[]) => {
    if (!bodyContent || bodyContent.length === 0) return "";
    const firstParagraph = bodyContent.find(block => block.type === 'paragraph' && block.children && block.children.length > 0);
    if (firstParagraph && firstParagraph.children[0] && firstParagraph.children[0].text) {
      return firstParagraph.children[0].text.substring(0, 150) + '...';
    }
    return "";
  };

  return (
    <div className="container-width py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Blog</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          if (!post) return null; // Defensive check
          return (
            <Link to={`/blog/${post.slug}`} key={post.id}>
              <Card className="h-full flex flex-col">
                {post.featuredImage?.data?.attributes?.url && (
                  <img 
                    src={`http://localhost:1337${post.featuredImage.data.attributes.url}`}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {post.author} on {new Date(post.publishedDate).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{getExcerpt(post.body)}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">No blog posts found. Please add content in Strapi.</p>
      )}
    </div>
  );
};

export default BlogIndex;
