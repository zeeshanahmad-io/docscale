import { Link } from "react-router-dom";
import { getAllBlogs } from "@/lib/loadBlogs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, MessageCircle } from "lucide-react";

function BlogIndex() {

  const posts = getAllBlogs();
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
        <div className="container-width px-4 py-16">
          <h1 className="text-4xl font-bold mb-10 text-foreground">Blog</h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.slug} className="block group h-full">
                <Card className="h-full flex flex-col justify-between bg-card shadow hover:shadow-lg transition-smooth">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold group-hover:text-accent transition-smooth mb-2">
                      {post.meta.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 mb-4 text-base leading-relaxed">{post.meta.description}</p>
                    <div className="text-sm text-gray-500 mt-4">
                      <span>{post.meta.author}</span> |
                      <span>{
                        post.meta.published_date && !isNaN(Date.parse(post.meta.published_date))
                          ? new Date(post.meta.published_date).toLocaleDateString()
                          : post.meta.published_date
                      }</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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

export default BlogIndex;