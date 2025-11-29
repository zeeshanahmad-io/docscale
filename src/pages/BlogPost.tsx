import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalendarDays, User, ArrowLeft, ArrowRight, List, Menu, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getPostBySlug } from "@/utils/blogUtils";
import ReactMarkdown from 'react-markdown';
import Image from '@/components/Image';
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
  const SITE_URL = (import.meta.env.VITE_SITE_URL as string) || 'https://docscale.in';

  const featuredImageAbsolute = post.featuredImage
    ? (post.featuredImage.startsWith('http') ? post.featuredImage : `${SITE_URL}${post.featuredImage}`)
    : undefined;

  // If a featured image exists, remove the first image from the markdown content
  // This prevents duplicate images if the user has manually added the cover image to the markdown body
  const content = post.featuredImage
    ? post.content.replace(/^\s*!\[.*?\]\(.*?\)/, '')
    : post.content;

  const readingTime = post ? Math.ceil(content.split(/\s+/).length / 200) : 0;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  useEffect(() => {
    // Generate table of contents from headings
    const headings = content.match(/^#{2,3}\s+(.+)$/gm);
    if (headings) {
      const toc = headings.map((heading, index) => {
        const level = heading.match(/^#+/)?.[0].length || 2;
        const title = heading.replace(/^#+\s+/, '');
        const id = `heading-${index}`;
        return { id, title, level };
      });
      setTableOfContents(toc);
    }
  }, [content]);

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
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/${post.slug}`} />
        <meta property="og:locale" content="en_IN" />
        {featuredImageAbsolute && <meta property="og:image" content={featuredImageAbsolute} />}
        <meta name="twitter:card" content={post.featuredImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        {featuredImageAbsolute && <meta name="twitter:image" content={featuredImageAbsolute} />}
        <meta name="twitter:image:alt" content={post.title} />
        <meta property="article:published_time" content={post.published_date} />
        <meta property="article:author" content={post.author} />
        <link rel="canonical" href={`${SITE_URL}/blog/${post.slug}`} />
        <link rel="alternate" type="application/rss+xml" title="DocScale RSS" href={`${SITE_URL}/rss.xml`} />
        {/* Preload featured image to improve LCP when available */}
        {featuredImageAbsolute && (
          <link rel="preload" as="image" href={featuredImageAbsolute} />
        )}
        {/* JSON-LD Article schema */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': post.title,
          'description': post.description,
          'image': featuredImageAbsolute,
          'author': {
            '@type': 'Person',
            'name': post.author
          },
          'datePublished': post.published_date,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/blog/${post.slug}`
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'DocScale',
            'logo': {
              '@type': 'ImageObject',
              'url': `${SITE_URL}/logo.png`
            }
          }
        })}</script>
      </Helmet>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="DocScale Logo" className="h-8" />
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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 pt-8">
                  <SheetClose asChild>
                    <Link to="/" className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Home</Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/blog" className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Blog</Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
                          className={`block w-full text-left text-sm transition-colors hover:text-primary ${item.level === 3 ? 'pl-4' : ''
                            } ${activeSection === item.id
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
            <div className="flex-1 max-w-4xl min-w-0 px-2 md:px-0">
              {/* Article Header without Placeholder Image */}
              <header className="mb-16 text-center">
                {post.featuredImage && (
                  <motion.img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-2xl mb-8"
                    layoutId={`image-${post.slug}`}
                  />
                )}
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium">{readingTime} min read</span>
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
                            className={`block w-full text-left text-sm transition-colors hover:text-primary ${item.level === 3 ? 'pl-4' : ''
                              } ${activeSection === item.id
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
              <div className="blog-content pr-2 md:pr-0">
                <ReactMarkdown
                  components={{
                    h1: ({ children, ...props }) => (
                      <h1 className="text-3xl font-bold mt-12 mb-6 text-foreground leading-tight" {...props}>
                        {children}
                      </h1>
                    ),
                    h2: ({ children, ...props }) => {
                      const id = `heading-${tableOfContents.findIndex(item => item.title === children)}`;
                      return (
                        <h2 id={id} className="text-2xl font-bold mt-10 mb-5 text-foreground scroll-mt-24" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const id = `heading-${tableOfContents.findIndex(item => item.title === children)}`;
                      return (
                        <h3 id={id} className="text-xl font-semibold mt-8 mb-4 text-foreground scroll-mt-24" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children, ...props }) => (
                      <p className="mb-6 leading-relaxed text-muted-foreground" {...props}>
                        {children}
                      </p>
                    ),
                    img: ({ src, alt, ...props }) => {
                      return (
                        <Image
                          src={src as string}
                          alt={alt as string || ''}
                          className="rounded-lg shadow-medium my-8"
                          {...props}
                        />
                      );
                    },
                    ul: ({ children, ...props }) => (
                      <ul className="space-y-3 mb-8 pl-6" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="space-y-3 mb-8 pl-6 list-decimal" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-muted-foreground pl-2" {...props}>
                        {children}
                      </li>
                    ),
                    a: ({ href, children, ...props }) => (
                      <a
                        href={href}
                        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-primary pl-6 py-2 my-8 italic text-lg text-muted-foreground bg-muted/30 rounded-r-lg" {...props}>
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, ...props }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {content}
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
                <img src="/logo.png" alt="DocScale Logo" className="h-8" />
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
                <li><Link to="/#services" className="hover:text-primary transition-colors">Website Development</Link></li>
                <li><Link to="/#services" className="hover:text-primary transition-colors">SEO Optimization</Link></li>
                <li><Link to="/#services" className="hover:text-primary transition-colors">Digital Marketing</Link></li>
                <li><Link to="/#services" className="hover:text-primary transition-colors">Online Reputation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/#services" className="hover:text-primary transition-colors">Case Studies</Link></li>
                <li><Link to="/#services" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/#contact" className="hover:text-primary transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="mailto:hello@docscale.in" className="hover:text-primary transition-colors">hello@docscale.in</a></li>
                <li><a href="tel:6299337816" className="hover:text-primary transition-colors">6299337816</a></li>
                <li>Bengaluru, India</li>
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