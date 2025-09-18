import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, ArrowLeft, ArrowRight } from "lucide-react";
import { getPostBySlug } from "@/utils/blogUtils";
import ReactMarkdown from 'react-markdown';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            DocScale
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-smooth">
              Home
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-smooth">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Back to Blog */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 p-0 h-auto text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </section>

      {/* Article */}
      <article className="pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Article Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {post.description}
            </p>
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {new Date(post.published_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none dark:prose-invert
            prose-headings:text-foreground prose-headings:font-semibold
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-li:text-muted-foreground prose-li:leading-relaxed
            prose-ul:my-6 prose-ol:my-6
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <Link to="/blog">
              <Button variant="primary" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Read More Articles
              </Button>
            </Link>
          </footer>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-primary mb-4">DocScale</div>
              <p className="text-muted-foreground">
                Building powerful digital solutions for healthcare professionals across India.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Website Development</li>
                <li>SEO Optimization</li>
                <li>Digital Marketing</li>
                <li>Online Reputation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li>Case Studies</li>
                <li>Documentation</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>hello@docscale.in</li>
                <li>+91 98765 43210</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 DocScale. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-40 rounded-full p-3 shadow-strong"
        variant="primary"
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </Button>
    </div>
  );
};

export default BlogPost;