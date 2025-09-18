import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, ArrowLeft, ArrowRight, List } from "lucide-react";
import { getPostBySlug } from "@/utils/blogUtils";
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet-async";

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showToc, setShowToc] = useState(false);
  
  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  useEffect(() => {
    // Generate table of contents from headings
    const headings = post.content.match(/^#{2,3}\s+(.+)$/gm);
    if (headings) {
      const toc = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const title = heading.replace(/^#+\s+/, '');
        const id = `heading-${index}`;
        return { id, title, level };
      });
      setTableOfContents(toc);
    }
  }, [post.content]);

  useEffect(() => {
    // Handle scroll spy for active section
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      const scrollPosition = window.scrollY + 100;

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i] as HTMLElement;
        if (heading.offsetTop <= scrollPosition) {
          setActiveSection(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
      </Helmet>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/src/assets/logo/logo.png" alt="DocScale Logo" className="h-8" />
            <span className="text-xl font-bold">
              <span className="text-primary">Doc</span>
              <span className="text-foreground">Scale</span>
            </span>
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
        <div className="container mx-auto px-4">
          <div className="flex gap-12 max-w-7xl mx-auto relative">
            {/* Table of Contents - Desktop Sidebar */}
            {tableOfContents.length > 0 && (
              <aside className="hidden xl:block w-80 shrink-0">
                <div className="sticky top-24">
                  <div className="bg-muted/30 rounded-lg p-6 border">
                    <div className="flex items-center gap-2 mb-4">
                      <List className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-foreground">Table of Contents</h3>
                    </div>
                    <nav className="space-y-2">
                      {tableOfContents.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                            item.level === 3 ? 'pl-4' : ''
                          } ${
                            activeSection === item.id 
                              ? 'text-primary font-medium' 
                              : 'text-muted-foreground'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 max-w-4xl">
              {/* Article Header without Placeholder Image */}
              <header className="mb-16 text-center">
                {/* If you want to add a real featured image, add an <img> here using post.slug or frontmatter */}
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                  {post.description}
                </p>
                {/* Enhanced Metadata */}
                <div className="flex items-center justify-center gap-8 text-muted-foreground bg-muted/30 rounded-lg p-6 max-w-lg mx-auto">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {new Date(post.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                </div>
              </header>

              {/* Mobile Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="xl:hidden mb-12">
                  <Button
                    variant="outline"
                    onClick={() => setShowToc(!showToc)}
                    className="w-full justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      Table of Contents
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${showToc ? 'rotate-90' : ''}`} />
                  </Button>
                  {showToc && (
                    <div className="mt-4 bg-muted/30 rounded-lg p-4 border">
                      <nav className="space-y-2">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              scrollToSection(item.id);
                              setShowToc(false);
                            }}
                            className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                              item.level === 3 ? 'pl-4' : ''
                            } ${
                              activeSection === item.id 
                                ? 'text-primary font-medium' 
                                : 'text-muted-foreground'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Article Content */}
              <div className="blog-content">
                <ReactMarkdown
                  components={{
                    h2: ({ children, ...props }) => {
                      const index = tableOfContents.findIndex(item => item.title === children?.toString());
                      const id = index >= 0 ? `heading-${index}` : undefined;
                      return (
                        <h2 
                          id={id} 
                          className="text-3xl font-bold text-foreground mt-16 mb-8 scroll-mt-24 pb-3 border-b border-border"
                          {...props}
                        >
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const index = tableOfContents.findIndex(item => item.title === children?.toString());
                      const id = index >= 0 ? `heading-${index}` : undefined;
                      return (
                        <h3 
                          id={id} 
                          className="text-2xl font-semibold text-foreground mt-12 mb-6 scroll-mt-24"
                          {...props}
                        >
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children, ...props }) => (
                      <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-none" {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="space-y-3 mb-8 pl-6" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="space-y-3 mb-8 pl-6" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-lg text-muted-foreground leading-relaxed relative">
                        <span className="absolute -left-6 top-0 text-primary font-bold">•</span>
                        {children}
                      </li>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-semibold text-foreground" {...props}>
                        {children}
                      </strong>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a 
                        href={href} 
                        className="text-primary font-medium underline-offset-4 hover:underline transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote 
                        className="border-l-4 border-primary bg-muted/30 pl-6 py-4 my-8 italic text-lg text-muted-foreground rounded-r-lg"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, ...props }) => (
                      <code 
                        className="bg-muted text-primary px-2 py-1 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
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
              <div className="flex items-center space-x-2 mb-4">
                <img src="/src/assets/logo/logo.png" alt="DocScale Logo" className="h-8" />
                <span className="text-xl font-bold">
                  <span className="text-primary">Doc</span>
                  <span className="text-foreground">Scale</span>
                </span>
              </div>
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