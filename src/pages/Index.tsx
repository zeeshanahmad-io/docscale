import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Search,
  Star,
  TrendingUp,
  FileText,
  Phone,
  MapPin,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Target,
  ExternalLink,
  Smartphone,
  Calendar,
  User,
  Send,
  Mail,
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Helmet } from "react-helmet-async";
import { FaWhatsapp } from "react-icons/fa";
// import heroImage from "@/assets/hero-doctor-patient.jpg"; // Removed to prevent double loading (using static public/images instead)
import qrCodeDemo from "@/assets/qr-code-demo.png";
import analyticsImage from "@/assets/analytics-dashboard.jpg";
import demoWebsiteScreenshot from "@/assets/demo-website-screenshot.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Suspense, lazy } from "react";

const PatientRevenueCalculator = lazy(() => import("@/components/tools/PatientRevenueCalculator").then(module => ({ default: module.PatientRevenueCalculator })));

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check for hash in URL and scroll to that section
    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    city: "",
    goals: "",
    source: "",
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL without page reload
      window.history.pushState({}, '', `/#${sectionId}`);
    }
  };

  const encode = (data: Record<string, string>) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...data as Record<string, string> })
      });

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "We'll get back to you within 24 hours with a customized strategy.",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          specialty: "",
          city: "",
          goals: "",
          source: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Digital Marketing for Doctors India 2025 | DocScale</title>
        <meta name="description" content="DocScale specializes in medical website design, healthcare SEO, and patient lead generation for doctors and clinics in India. Grow your practice with our data-driven digital marketing services." />
        <link rel="canonical" href="https://docscale.in/" />
        <meta property="og:title" content="Medical Website Design & SEO for Doctors in India | DocScale" />
        <meta property="og:description" content="Attract more patients with expert digital marketing. We build high-converting websites and rank your clinic on Google." />
        <meta property="og:image" content="https://docscale.in/images/hero-doctor-patient.jpg" />
        <meta property="og:image:alt" content="Professional doctor consulting with patient in modern clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://docscale.in/images/hero-doctor-patient.jpg" />
        <meta name="twitter:image:alt" content="Professional doctor consulting with patient in modern clinic" />

        {/* JSON-LD Structured Data for LLMs and Search Engines */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "DocScale",
              "image": "https://docscale.in/logo.png",
              "url": "https://docscale.in",
              "telephone": "+916299337816",
              "email": "contact@docscale.in",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bengaluru",
                "addressCountry": "IN"
              },
              "priceRange": "₹₹",
              "description": "Digital marketing agency specializing in healthcare marketing for doctors and medical clinics in India. Services include Medical Website Design, Healthcare SEO, and Google Ads.",
              "serviceArea": {
                "@type": "Country",
                "name": "India"
              },
              "offers": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Medical Website Design"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Healthcare SEO"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Patient Lead Generation"
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-smooth">
        <div className="container-width">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="DocScale Logo" className="h-8" width="32" height="32" />
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
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-smooth">Blog</Link>
              <Link to="/tools/seo-auditor">
                <Button variant="outline" size="sm" className="hidden lg:flex border-primary text-primary hover:bg-primary hover:text-white">
                  Free SEO Audit
                </Button>
              </Link>
              <Button onClick={() => scrollToSection('contact')} variant="primary" size="sm">Get Started</Button>
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open main menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 pt-8">
                    <SheetClose asChild>
                      <button onClick={() => scrollToSection('hero')} className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Home</button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button onClick={() => scrollToSection('features')} className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Features</button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button onClick={() => scrollToSection('services')} className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Services</button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button onClick={() => scrollToSection('about')} className="text-lg font-medium text-foreground hover:text-primary transition-smooth">About</button>
                    </SheetClose>
                    <SheetClose asChild>
                      <button onClick={() => scrollToSection('case-study')} className="text-lg font-medium text-foreground hover:text-primary transition-smooth">Our Work</button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/blog" className="w-full text-center text-lg font-medium text-foreground hover:text-primary transition-smooth">Blog</Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/tools/seo-auditor" className="w-full">
                        <Button variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                          Free SEO Audit
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={() => scrollToSection('contact')} variant="primary" size="lg">Get Started</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
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
                  Digital Marketing for Doctors in India.
                  <span className="block text-accent">Grow Your Medical Practice.</span>
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  We provide specialized healthcare SEO and medical website design solutions to help doctors and clinics in India attract more patients online.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection('contact')} variant="accent" size="lg" className="text-lg px-8">
                  Get a Free Consultation
                </Button>
                <Link to="/tools/seo-auditor">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-colors">
                    Free SEO Audit
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/hero-doctor-patient.jpg"
                alt="Professional doctor consulting with patient in modern clinic"
                className="rounded-2xl shadow-strong w-full"
                width="600"
                height="400"
                loading="eager"
                // @ts-expect-error - fetchpriority is a valid attribute but not yet in React types for this version
                fetchpriority="high"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">1000+ Happy Patients</span>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-white text-accent-foreground p-4 rounded-xl shadow-medium">
                <div className="flex items-center space-x-2">
                  <div className="bg-white p-2 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-lg leading-none">4.9/5 Rating</div>
                    <div className="text-xs opacity-90">from 50+ Doctors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Revenue Calculator Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-width">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Is Your Practice Losing?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the potential revenue impact of optimizing your digital presence.
            </p>
          </div>
          <Suspense fallback={<div className="h-96 w-full max-w-2xl mx-auto bg-muted/20 animate-pulse rounded-xl" />}>
            <PatientRevenueCalculator />
          </Suspense>
        </div>
      </section>

      {/* Services Section */}
      < section id="services" className="section-padding bg-secondary/50" >
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Healthcare Digital Marketing Services
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
      </section >

      {/* About Section */}
      < section id="about" className="section-padding" >
        <div className="container-width">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                India's Leading Healthcare Marketing Agency
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
                width="600"
                height="400"
                loading="lazy"
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
      </section >

      {/* Core Features Section */}
      < section id="features" className="section-padding bg-secondary/50" >
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
                icon: <FaWhatsapp className="h-8 w-8" />,
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
      </section >

      {/* Case Study Section */}
      < section id="case-study" className="section-padding bg-secondary/30" >
        <div className="container-width">
          <div className="text-center space-y-4 mb-16 animate-slide-up">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Real Results: Medical Digital Marketing Case Studies
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
                        onClick={() => window.open("https://drfaiyazahmad.com/", "_blank")}
                      >
                        <span>View Live Demo</span>
                        <ExternalLink className="w-5 h-5" />
                      </Button>

                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <img
                          src={qrCodeDemo}
                          alt="QR code for mobile demo"
                          className="w-16 h-16"
                          width="64"
                          height="64"
                          loading="lazy"
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
                        <img
                          src={demoWebsiteScreenshot}
                          alt="Live Demo Website Screenshot"
                          className="rounded-xl w-full h-auto object-cover"
                          width="400"
                          height="800"
                          loading="lazy"
                        />
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
      </section >

      {/* FAQ Section */}
      < section id="faq" className="section-padding" >
        <div className="container-width">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Common questions about digital marketing for doctors in India
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg font-semibold">How much does digital marketing cost for doctors in India?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  Digital marketing costs for doctors in India vary based on services. Basic packages for SEO and website maintenance typically start from ₹15,000/month. Comprehensive packages including Google Ads, content marketing, and reputation management can range from ₹30,000 to ₹75,000/month depending on your practice size and goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg font-semibold">How long does SEO take to work for medical practices?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  Healthcare SEO is a long-term strategy. You can typically expect to see initial improvements in 3-4 months, with significant rankings and patient inquiry growth by 6 months. The timeline depends on the competitiveness of your specialty and location.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-lg font-semibold">Do I really need a website for my clinic?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  Yes. In 2024, over 70% of patients search online before booking an appointment. A professional website acts as your digital clinic, building trust, showcasing your expertise, and allowing patients to book appointments 24/7. It is the foundation of your digital presence.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-lg font-semibold">What is the best digital marketing strategy for doctors?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  The most effective strategy combines Local SEO (to rank for "near me" searches), Google Ads (for immediate patient leads), and Content Marketing (to build trust). Online Reputation Management is also critical to ensure your patient reviews reflect the quality of your care.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section >

      {/* Get Started Section */}
      < section id="get-started" className="section-padding" >
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Ready to Grow Your Practice?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer tailored solutions to fit the unique needs of your practice. Contact us today for a free consultation and a custom quote.
            </p>
          </div>
          <div className="text-center">
            <Button onClick={() => scrollToSection('contact')} variant="primary" size="lg">
              Get a Free Consultation
            </Button>
          </div>
        </div>
      </section >

      {/* Contact Section */}
      < section id="contact" className="py-20 bg-secondary/30" >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to Grow Your Practice?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tell us about your practice, and we'll prepare a custom strategy
              to help you attract more patients and build your digital presence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <Card className="border-0 shadow-card bg-gradient-to-br from-card to-secondary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Get Your Free Consultation
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Fill out the form below and we'll prepare a tailored strategy for your practice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-netlify="true"
                  name="contact"
                  method="POST"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <input type="hidden" name="source" value={formData.source} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialty">Medical Specialty *</Label>
                      <Select name="specialty" onValueChange={(value) => handleInputChange("specialty", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Physician</SelectItem>
                          <SelectItem value="dermatology">Dermatologist</SelectItem>
                          <SelectItem value="orthopedic">Orthopedic Surgeon</SelectItem>
                          <SelectItem value="cardiology">Cardiologist</SelectItem>
                          <SelectItem value="pediatrics">Pediatrician</SelectItem>
                          <SelectItem value="gynecology">Gynecologist</SelectItem>
                          <SelectItem value="dentistry">Dentist</SelectItem>
                          <SelectItem value="ophthalmology">Ophthalmologist</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city">City & State of Practice *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="e.g., Mumbai, Maharashtra"
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals">What are your primary goals? *</Label>
                    <Textarea
                      id="goals"
                      name="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange("goals", e.target.value)}
                      placeholder="e.g., Attract more patients, improve online reviews, build brand awareness..."
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="source">How did you hear about us?</Label>
                    <Select name="source" onValueChange={(value) => handleInputChange("source", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="referral">Doctor Referral</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message & Get Free Strategy
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-0 shadow-card bg-gradient-to-br from-card to-secondary/20">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    Get in Touch Directly
                  </h3>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Phone</div>
                        <div className="text-muted-foreground">+91 6299337816</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <div className="text-muted-foreground">contact@docscale.in</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Location</div>
                        <div className="text-muted-foreground">Bengaluru, India</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-card bg-gradient-to-br from-card to-secondary/20 border-l-4 border-l-primary">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    What Happens Next?
                  </h3>

                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Strategy Call</div>
                        <div className="text-sm">We'll schedule a 30-minute consultation to understand your practice</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Custom Proposal</div>
                        <div className="text-sm">Receive a tailored strategy and pricing within 48 hours</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                        3
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Start Growing</div>
                        <div className="text-sm">Begin attracting new patients within the first month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="bg-foreground text-background py-12" >
        <div className="container-width">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img src="/logo.png" alt="DocScale Logo" className="h-8" />
              <span className="text-xl font-bold text-background">
                <span className="text-primary">Doc</span>
                <span className="text-background">Scale</span>
              </span>
            </div>
            <p className="text-background/80 max-w-2xl mx-auto">
              Helping healthcare professionals build powerful digital practices that attract more patients and grow their reputation online.
            </p>
            <div className="flex justify-center space-x-6 pt-4">
              <Link to="/privacy-policy">
                <Button variant="ghost" size="sm" className="text-background hover:text-primary">
                  Privacy Policy
                </Button>
              </Link>
              <Link to="/terms-of-service">
                <Button variant="ghost" size="sm" className="text-background hover:text-primary">
                  Terms of Service
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-background hover:text-primary"
                onClick={() => scrollToSection('contact')}
              >
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
      </footer >

      {/* Floating WhatsApp Button */}
      < div className="fixed bottom-6 right-6 z-40" >
        <a
          href="https://wa.me/916299337816?text=Hello%2C%20I%27m%20interested%20in%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full p-3 shadow-strong animate-float bg-green-500 hover:bg-green-600 flex items-center justify-center text-white [&_svg]:!size-10"
        >
          <FaWhatsapp />
        </a>
      </div >
    </div >
  );
};

export default Index;