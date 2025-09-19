import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/src/assets/logo/logo.png" alt="DocScale Logo" className="h-8" />
              <span className="text-xl font-bold">
                <span className="text-primary">Doc</span>
                <span className="text-foreground">Scale</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-smooth">Home</Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition-smooth">Blog</Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-smooth">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Terms of Service Content */}
      <div className="pt-20 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8"><strong>Last Updated:</strong> September 19, 2025</p>
            
            <div className="space-y-8 text-foreground">
              <p className="text-lg">
                Welcome to DocScale. By using our website and engaging in our services, you agree to these Terms of Service.
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Services</h2>
                <p>
                  DocScale provides digital marketing services, including website design, SEO, content creation, and online reputation management, as detailed in our service packages.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Client Responsibilities</h2>
                <p>
                  You agree to provide all necessary information, content, and access (e.g., to your Google My Business account) required for us to perform the services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Fees and Payment</h2>
                <p>
                  All fees are outlined in our service proposals. Payment terms and schedules will be specified in the agreement. Failure to make timely payments may result in the suspension or termination of services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                <p>
                  Any intellectual property created by DocScale (e.g., website code, marketing strategies) remains the property of DocScale unless otherwise agreed upon in writing.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
                <p>
                  DocScale shall not be liable for any indirect or consequential damages, including loss of profits, arising from the use of our services. Our total liability is limited to the fees paid by the client for the specific services in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Governing Law</h2>
                <p>
                  These Terms shall be governed by the laws of India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or update these Terms of Service at any time. We will notify you of significant changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
                <p>Email: contact@docscale.com</p>
              </section>

              <section className="border-t border-border pt-8">
                <p className="text-sm text-muted-foreground italic">
                  <strong>Disclaimer:</strong> This is a general terms of service agreement. We highly recommend that you consult with a legal professional to create a comprehensive and legally binding contract tailored to your business operations.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;