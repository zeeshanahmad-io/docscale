import { useParams } from "react-router-dom";
import { getBlogBySlug } from "@/lib/loadBlogs";
import { Stethoscope, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-width px-4 py-16">
          <h1 className="text-2xl font-bold text-foreground">Blog post not found</h1>
        </div>
      </div>
    );
  }

  // Set meta description (for SEO)
  if (post.meta.description) {
    document.title = post.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.meta.description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = post.meta.description;
      document.head.appendChild(meta);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
        <div className="container-width">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">DocScale</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-smooth">Home</a>
              <a href="/blog" className="text-accent font-medium">Blog</a>
              <Button onClick={() => window.location.href='/#contact'} variant="primary" size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24">
        <div className="container-width px-4 py-16 max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 leading-tight">{post.meta.title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-base mb-4">
              <span>By <span className="font-semibold text-primary">{post.meta.author}</span></span>
              <span className="mx-2">|</span>
              <span>{post.meta.published_date && !isNaN(Date.parse(post.meta.published_date)) ? new Date(post.meta.published_date).toLocaleDateString() : post.meta.published_date}</span>
            </div>
            <p className="text-lg text-muted-foreground mb-6 font-medium">{post.meta.description}</p>
          </header>
          <article
            className="prose prose-lg prose-headings:text-foreground prose-headings:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:mt-6 prose-h3:mb-2 prose-p:mb-5 prose-p:leading-relaxed prose-li:mb-2 prose-img:rounded-lg prose-img:shadow-lg text-foreground"
            style={{ fontFamily: 'inherit' }}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-background py-12 mt-auto">
        <div className="container-width">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Stethoscope className="h-8 w-8 text-background" />
              <span className="text-2xl font-bold">MedGrow Digital</span>
            </div>
            <p className="text-background/80 max-w-2xl mx-auto">
              Helping healthcare professionals build powerful digital practices that attract more patients and grow their reputation online.
            </p>
            <div className="flex justify-center space-x-6 pt-4">
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">Privacy Policy</Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">Terms of Service</Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">Contact Us</Button>
            </div>
            <div className="border-t border-background/20 pt-6">
              <p className="text-background/60">
                © 2024 MedGrow Digital. All rights reserved. Built with ❤️ for healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <a href="https://wa.me/919999999999?text=Hello%2C%20I%27m%20interested%20in%20your%20services." target="_blank" rel="noopener noreferrer">
          <Button 
            variant="primary" 
            size="lg" 
            className="rounded-full p-4 shadow-strong animate-float"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </a>
      </div>
    </div>
  );
}
