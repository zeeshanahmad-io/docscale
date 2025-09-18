import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Search, 
  Star, 
  TrendingUp, 
  FileText, 
  Phone, 
  MessageCircle, 
  MapPin,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Target,
  ExternalLink,
  Smartphone,
  Calendar,
  User
} from "lucide-react";
import heroImage from "@/assets/hero-doctor-patient.jpg";
import qrCodeDemo from "@/assets/qr-code-demo.png";
import analyticsImage from "@/assets/analytics-dashboard.jpg";

const Index = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
        <div className="container-width">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/src/assets/logo/logo.png" alt="DocScale Logo" className="h-8" />
              <span className="text-xl font-bold">
                <span className="text-primary">Doc</span>
                <span className="text-foreground">Scale</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('hero')} className="text-muted-foreground hover:text-foreground transition-smooth">Home</button>
              <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-smooth">Features</button>
              <button onClick={() => scrollToSection('services')} className="text-muted-foreground hover:text-foreground transition-smooth">Services</button>
              <button onClick={() => scrollToSection('about')} className="text-muted-foreground hover:text-foreground transition-smooth">About</button>
              <button onClick={() => scrollToSection('case-study')} className="text-muted-foreground hover:text-foreground transition-smooth">Our Work</button>
              <button onClick={() => scrollToSection('pricing')} className="text-muted-foreground hover:text-foreground transition-smooth">Pricing</button>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-smooth">Blog</Link>
              <Button onClick={() => scrollToSection('contact')} variant="primary" size="sm">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="section-padding pt-24 hero-gradient text-white">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Attract New Patients. 
                  <span className="block text-accent">Build Your Digital Practice.</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  We provide specialized digital marketing solutions to help doctors and clinics in India thrive in the online world.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection('contact')} variant="accent" size="lg" className="text-lg px-8">
                  Get a Free Consultation
                </Button>
                <Button onClick={() => scrollToSection('services')} variant="secondary" size="lg" className="text-lg px-8">
                  Learn More About Our Services
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional doctor consulting with patient in modern clinic" 
                className="rounded-2xl shadow-strong w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">1000+ Happy Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-secondary/50">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Your Complete Digital Growth Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to establish a strong online presence and attract more patients
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Stethoscope className="h-8 w-8" />,
                title: "Website Design & Development",
                description: "A professional, mobile-friendly website that is your digital clinic, designed for seamless patient booking."
              },
              {
                icon: <Search className="h-8 w-8" />,
                title: "Search Engine Optimization (SEO)",
                description: "We ensure your practice appears at the top of Google searches, bringing new patients to your door without paid ads."
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: "Online Reputation Management (ORM)",
                description: "We proactively manage your online reviews to build trust and protect your professional brand."
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Google Ads & Paid Campaigns",
                description: "Reach patients actively searching for your specialty with high-performing, data-driven ad campaigns that deliver immediate results."
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Content Marketing",
                description: "We create expert blog posts and articles for your website to establish you as a thought leader in your field."
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "24/7 Support & Monitoring",
                description: "Round-the-clock monitoring of your digital presence with dedicated support to ensure everything runs smoothly."
              }
            ].map((service, index) => (
              <Card key={index} className="card-gradient p-8 hover:shadow-medium transition-spring border-0">
                <div className="text-primary mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding">
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                Our Mission. Our Expertise.
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  DocScale was founded to bring a modern, tech-driven approach to an industry that relies on trust and expertise. 
                  We understand that healthcare is built on relationships, but we also know that technology can enhance these connections 
                  and make them more accessible to patients who need care.
                </p>
                <p>
                  Our mission is simple: to help healthcare professionals thrive in the digital age through efficient, 
                  data-driven marketing solutions. We combine cutting-edge technology with a deep understanding of the healthcare 
                  sector to deliver results that matter—more patients, stronger reputations, and sustainable growth.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-semibold">Technology-Driven</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="font-semibold">Healthcare-Focused</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={analyticsImage} 
                alt="Digital analytics dashboard showing healthcare practice growth metrics" 
                className="rounded-2xl shadow-strong w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-white p-4 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">Data-Driven Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="section-padding bg-secondary/50">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              The Features Your Patients Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We don't just build websites; we build powerful tools that connect you with your patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <User className="h-8 w-8" />,
                title: "Professional About Section",
                description: "Build trust and credibility with a dedicated section that highlights your qualifications, experience, and patient-first philosophy."
              },
              {
                icon: <Calendar className="h-8 w-8" />,
                title: "Easy Appointment Booking",
                description: "Allow patients to book appointments directly from the website, simplifying the process for both you and your patients."
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: "Find on Google Maps",
                description: "Help patients find your clinic with ease. We integrate a direct link to your location on Google Maps."
              },
              {
                icon: <Phone className="h-8 w-8" />,
                title: "Call Now Button",
                description: "A convenient, one-click button that allows patients to call your clinic directly from their mobile phone."
              },
              {
                icon: <MessageCircle className="h-8 w-8" />,
                title: "WhatsApp Consultation Link",
                description: "Offer a direct communication channel for patients to inquire about services or schedule a consultation via WhatsApp."
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Detailed Service Listings",
                description: "Clearly showcase the full range of services you provide, from treatments to consultations, helping patients make informed decisions."
              }
            ].map((feature, index) => (
              <Card key={index} className="card-gradient p-8 hover:shadow-medium transition-spring border-0">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section id="case-study" className="section-padding bg-secondary/30">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              See Our Work in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              We build websites that are more than just a digital presence—they are 
              patient acquisition machines. Explore a live example of our work.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="gradient-card border-0 shadow-large overflow-hidden animate-scale">
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-8">
                <CardTitle className="text-2xl mb-2">
                  Case Study: Solo Practitioner Digital Growth
                </CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  A complete digital branding and marketing strategy for a leading 
                  specialist in a Tier 1 city. We developed a professional website 
                  with an integrated booking system and a patient-focused content strategy.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Demo Links */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-6">
                      Live Demo Available
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full justify-between"
                        onClick={() => window.open("https://demo-doctor-website.com", "_blank")}
                      >
                        <span>View Live Demo</span>
                        <ExternalLink className="w-5 h-5" />
                      </Button>
                      
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <img
                          src={qrCodeDemo}
                          alt="QR code for mobile demo"
                          className="w-16 h-16"
                        />
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Scan to view on your phone
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Experience the mobile-optimized design
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Results Metrics */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">
                        Results Achieved:
                      </h4>
                      {[
                        {
                          icon: Users,
                          value: "300%",
                          label: "Patient Inquiries",
                          description: "Increase in monthly patient bookings",
                        },
                        {
                          icon: TrendingUp,
                          value: "#1",
                          label: "Google Ranking",
                          description: "Top position for specialty keywords",
                        },
                        {
                          icon: Star,
                          value: "4.9",
                          label: "Review Rating",
                          description: "Average Google review score",
                        },
                      ].map((metric, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-3 bg-background rounded-lg shadow-soft"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <metric.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-accent">
                                {metric.value}
                              </span>
                              <span className="text-sm font-medium text-foreground">
                                {metric.label}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {metric.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Screenshot Preview */}
                  <div className="animate-fade-in">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-2xl shadow-large">
                        <div className="bg-background rounded-xl p-8 h-80 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full mx-auto flex items-center justify-center">
                              <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                              Dr. Smith's Clinic
                            </h3>
                            <p className="text-muted-foreground">
                              Modern Healthcare Excellence
                            </p>
                            <Button variant="primary" size="sm">
                              Book Appointment
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-4 -right-4 bg-accent text-white p-3 rounded-xl shadow-medium">
                        <div className="text-xs font-medium">Mobile Optimized</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-padding">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Simple, Straightforward Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transparent pricing designed to grow your practice. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: "Digital Launchpad",
                subtitle: "Solo practitioners and new clinics",
                price: "₹12,000",
                period: "month",
                features: [
                  "Professional Website Design",
                  "Local SEO Optimization",
                  "Google My Business Setup",
                  "Basic Content Creation",
                  "Monthly Performance Reports"
                ]
              },
              {
                title: "Growth Accelerator",
                subtitle: "Established doctors and growing clinics",
                price: "₹30,000",
                period: "month",
                popular: true,
                features: [
                  "Everything in Digital Launchpad",
                  "Comprehensive SEO Strategy",
                  "Google Ads Management",
                  "Content Marketing",
                  "Online Reputation Management",
                  "Weekly Strategy Calls"
                ]
              },
              {
                title: "Custom Solution",
                subtitle: "Multi-specialty clinics or large practices",
                price: "Custom",
                period: "Quote",
                features: [
                  "Fully Tailored Strategy",
                  "Multi-location Management",
                  "Advanced Analytics",
                  "Dedicated Account Manager",
                  "24/7 Priority Support",
                  "Custom Integrations"
                ]
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'border-2 border-primary shadow-strong' : 'card-gradient border-0'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-2xl font-bold text-foreground">{plan.title}</h3>
                  <p className="text-muted-foreground">{plan.subtitle}</p>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-foreground">
                      {plan.price}
                      <span className="text-lg font-normal text-muted-foreground">/{plan.period}</span>
                    </div>
                    {index < 2 && <p className="text-sm text-muted-foreground">Starting from</p>}
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => scrollToSection('contact')} 
                  variant={plan.popular ? "primary" : "outline"} 
                  size="lg" 
                  className="w-full"
                >
                  {index === 2 ? "Get Custom Quote" : "Get Started"}
                </Button>
              </Card>
            ))}
          </div>

          <Card className="accent-gradient p-6 text-center">
            <h4 className="text-lg font-semibold text-accent-foreground mb-2">
              Why Our Prices are a Starting Point
            </h4>
            <p className="text-accent-foreground">
              The final investment depends on market competition, specific service needs, and your budget. 
              We believe in transparent pricing that delivers real value for your practice.
            </p>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-secondary/50">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Ready to Grow Your Practice?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tell us about your practice, and we'll prepare a custom strategy to help you attract more patients.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="card-gradient p-8 lg:p-12 shadow-medium border-0">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input placeholder="Dr. Your Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Medical Specialty</label>
                    <Input placeholder="e.g., General Physician, Dermatologist" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City & State of Practice</label>
                  <Input placeholder="e.g., Mumbai, Maharashtra" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">What are your primary goals?</label>
                  <Textarea placeholder="e.g., Attract more patients, improve online reviews, increase appointment bookings..." />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Approximate Budget</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10k-25k">₹10k-25k</SelectItem>
                        <SelectItem value="25k-50k">₹25k-50k</SelectItem>
                        <SelectItem value="50k+">₹50k+</SelectItem>
                        <SelectItem value="discuss">I'd like to discuss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">How did you hear about us?</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button variant="primary" size="lg" className="w-full text-lg">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container-width">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img src="/src/assets/logo/logo.png" alt="DocScale Logo" className="h-8" />
              <span className="text-xl font-bold text-background">
                <span className="text-primary">Doc</span>
                <span className="text-background">Scale</span>
              </span>
            </div>
            <p className="text-background/80 max-w-2xl mx-auto">
              Helping healthcare professionals build powerful digital practices that attract more patients and grow their reputation online.
            </p>
            <div className="flex justify-center space-x-6 pt-4">
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">
                Privacy Policy
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">
                Terms of Service
              </Button>
              <Button variant="ghost" size="sm" className="text-background hover:text-primary">
                Contact Us
              </Button>
            </div>
            <div className="border-t border-background/20 pt-6">
              <p className="text-background/60">
                © 2025 DocScale. All rights reserved.
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
};

export default Index;