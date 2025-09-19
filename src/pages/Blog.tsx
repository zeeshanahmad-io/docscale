import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getAllPosts } from "@/utils/blogUtils";
import { Link } from "react-router-dom";

const Blog = () => {
  const posts = getAllPosts();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
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
            <Link to="/blog" className="text-foreground font-medium">
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

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Healthcare Marketing Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
            Expert tips, strategies, and insights to help your medical practice thrive in the digital age.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="card-gradient border-0 hover:shadow-medium transition-spring group">
                <CardHeader className="p-0">
                  <img src={post.featuredImage} alt={post.title} className="rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(post.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {post.description}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {post.excerpt.replace(/!\[[^\]]*\]\([^)]*\)/g, "").trim()}
                  </p>
                  <Link to={`/blog/${post.slug}`}>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
                <li>6299337816</li>
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

export default Blog;