import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="DocScale Logo" className="h-8" />
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

      {/* Privacy Policy Content */}
      <div className="pt-20 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8"><strong>Last Updated:</strong> September 19, 2025</p>
            
            <div className="space-y-8 text-foreground">
              <p className="text-lg">
                At DocScale, we are committed to protecting your privacy. This policy outlines how we collect, use, and protect your personal information when you use our website and services.
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p className="mb-4">We collect information to provide and improve our services to you. This may include:</p>
                <p className="mb-4">
                  <strong>Personal Identification Information:</strong> Name, email address, phone number, and professional details (clinic name, medical specialty) that you provide through our contact forms or consultations.
                </p>
                <p>
                  <strong>Technical Data:</strong> IP address, browser type, device information, and usage data collected through cookies and analytics tools (like Google Analytics). This information is used to improve our website&apos;s performance and analyze user behavior.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and operate our services to you.</li>
                  <li>To respond to your inquiries and provide customer support.</li>
                  <li>To improve our website and services.</li>
                  <li>For marketing purposes, such as sending you newsletters or updates about our services (with your consent).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Data Security and Storage</h2>
                <p>
                  We implement reasonable security measures to protect your personal information. Your data is stored on secure servers and protected against unauthorized access.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
                <p>
                  You have the right to access, update, or request the deletion of your personal information. To do so, please contact us at contact@docscale.in.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
                <p>
                  Our website uses cookies to enhance your experience. You can choose to disable cookies through your browser settings, but this may affect some features of the site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
                <p>Email: contact@docscale.in</p>
              </section>

              <section className="border-t border-border pt-8">
                <p className="text-sm text-muted-foreground italic">
                  <strong>Disclaimer:</strong> This is a general privacy policy. We recommend that you consult with a legal professional to ensure full compliance with all applicable laws in India, including the Information Technology Act, 2000.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;