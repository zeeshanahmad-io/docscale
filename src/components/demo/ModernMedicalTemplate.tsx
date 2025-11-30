import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Clock, CheckCircle2, Menu, X, Star, Quote, Facebook, Linkedin, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface ModernMedicalTemplateProps {
    data: any;
    theme: any;
    name: string;
    specialtyLabel: string;
    city: string;
    phone: string;
    location: string;
}

const ModernMedicalTemplate = ({ data, theme, name, specialtyLabel, city, phone, location }: ModernMedicalTemplateProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toast } = useToast();

    // Font loading
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    const handleBookClick = () => {
        toast({
            title: "Booking Feature 📅",
            description: "This would open your appointment scheduling system.",
            duration: 3000,
        });
    };

    const handleWhatsAppClick = () => {
        toast({
            title: "WhatsApp Integration 💬",
            description: "This would open your WhatsApp number to chat with patients.",
            duration: 3000,
        });
    };

    const handleSocialClick = (platform: string) => {
        toast({
            title: `${platform} Page 📱`,
            description: `This would open the doctor's ${platform} profile.`,
            duration: 3000,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/20" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Helmet>
                <title>{name} - Top {specialtyLabel} in {city}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Floating WhatsApp Button */}
            <button
                onClick={handleWhatsAppClick}
                className="fixed bottom-24 right-6 z-40 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
                style={{ backgroundColor: '#25D366' }}
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="absolute right-full mr-3 bg-white text-slate-800 px-3 py-1 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Chat with us
                </span>
            </button>

            {/* Top Bar */}
            <div className="bg-white border-b border-slate-100 py-2 px-4 text-xs font-medium text-slate-500 hidden md:block">
                <div className="container mx-auto max-w-7xl flex justify-between items-center">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" style={{ color: theme.primary }} /> {phone}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" style={{ color: theme.primary }} /> {location}</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" style={{ color: theme.primary }} /> Mon - Sat: 10:00 AM - 7:00 PM</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/50 z-40">
                <div className="container mx-auto max-w-7xl px-4 py-4 flex justify-between items-center">
                    <div className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ background: theme.gradient }}>
                            {name.charAt(0)}
                        </div>
                        <span className="text-slate-900">{name}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
                        <button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors">Home</button>
                        <button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Services</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About</button>
                        <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors">Testimonials</button>
                        <Button
                            onClick={handleBookClick}
                            style={{ backgroundColor: theme.primary }}
                            className="hover:opacity-90 rounded-full px-6 shadow-md shadow-primary/20 transition-transform hover:scale-105"
                        >
                            Book Visit
                        </Button>
                    </div>
                    <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-xl absolute w-full animate-in slide-in-from-top-5">
                        <button onClick={() => scrollToSection('home')} className="text-left py-2 font-medium text-slate-600">Home</button>
                        <button onClick={() => scrollToSection('services')} className="text-left py-2 font-medium text-slate-600">Services</button>
                        <button onClick={() => scrollToSection('about')} className="text-left py-2 font-medium text-slate-600">About</button>
                        <button onClick={() => scrollToSection('testimonials')} className="text-left py-2 font-medium text-slate-600">Testimonials</button>
                        <Button onClick={handleBookClick} style={{ backgroundColor: theme.primary }} className="w-full rounded-full">Book Appointment</Button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 relative z-10">
                            <div
                                style={{ color: theme.primary, backgroundColor: theme.secondary }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-6 border border-primary/10"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: theme.primary }}></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: theme.primary }}></span>
                                </span>
                                ACCEPTING NEW PATIENTS
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Modern Care for <br />
                                <span className="text-transparent bg-clip-text" style={{ backgroundImage: theme.gradient }}>
                                    Better Living
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                                {data.heroDescription || `Experience world-class ${specialtyLabel.toLowerCase()} treatments with ${name}. Advanced technology meets compassionate care.`}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={handleBookClick}
                                    size="lg"
                                    style={{ backgroundColor: theme.primary }}
                                    className="hover:opacity-90 rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/25"
                                >
                                    Book Consultation
                                </Button>
                                <Button
                                    onClick={() => scrollToSection('services')}
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full px-8 h-12 text-base border-slate-200 hover:bg-slate-50 text-slate-700"
                                >
                                    Explore Services
                                </Button>
                            </div>

                            {/* Stats Row */}
                            <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 border-t border-slate-200 pt-8">
                                {data.stats.map((stat: any, index: number) => (
                                    <div key={index}>
                                        <div className="text-2xl md:text-3xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>{stat.value}</div>
                                        <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 relative">
                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5] md:aspect-square lg:aspect-[4/5]">
                                <img src={data.heroImage} alt="Doctor Hero" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                                {/* Floating Card */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Star className="w-6 h-6 fill-current" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">Top Rated Clinic</div>
                                            <div className="text-sm text-slate-500">5-Star Patient Reviews</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" style={{ backgroundColor: theme.primary }}></div>
                            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section with Images */}
            <section id="services" className="py-20 bg-white">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Specialized Treatments
                        </h2>
                        <p className="text-lg text-slate-600">
                            Comprehensive care tailored to your specific needs using the latest medical advancements.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {data.services.map((service: any, index: number) => (
                            <div key={index} className="group rounded-2xl overflow-hidden border border-slate-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={service.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2940&auto=format&fit=crop"}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-slate-50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-20" style={{ backgroundColor: theme.primary }}></div>
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <img src={data.aboutImage} alt="About Doctor" className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3]" />
                                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 max-w-xs hidden md:block">
                                    <p className="text-slate-900 font-medium italic">"{name} is simply the best. Professional, kind, and extremely skilled."</p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <span className="text-xs text-slate-500 font-bold">VERIFIED PATIENT</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider mb-4">
                                    MEET THE DOCTOR
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {name}
                                </h2>
                                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                    With over {data.stats[2].value} years of experience, {name} is a renowned {specialtyLabel} in {city}.
                                    Dedicated to providing personalized care, {name} combines medical expertise with a compassionate approach.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="text-2xl font-bold text-slate-900 mb-1" style={{ color: theme.primary }}>MBBS, MD</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">Qualification</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="text-2xl font-bold text-slate-900 mb-1" style={{ color: theme.primary }}>10k+</div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">Happy Patients</div>
                                    </div>
                                </div>
                                <Button onClick={handleBookClick} size="lg" style={{ backgroundColor: theme.primary }} className="rounded-full px-8">
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {data.testimonials && data.testimonials.length > 0 && (
                <section id="testimonials" className="py-20 bg-white">
                    <div className="container mx-auto max-w-7xl px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Patient Stories
                            </h2>
                            <p className="text-lg text-slate-600">
                                Read what our patients have to say about their experience.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {data.testimonials.map((t: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-8 rounded-2xl relative">
                                    <Quote className="w-10 h-10 text-slate-200 absolute top-6 right-6" />
                                    <div className="flex gap-1 text-yellow-400 mb-4">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-6 leading-relaxed">"{t.text}"</p>
                                    <div className="font-bold text-slate-900">{t.name}</div>
                                    <div className="text-xs text-slate-500 font-medium">Verified Patient</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 z-0">
                    <img src="https://images.unsplash.com/photo-1576091160550-2187d80a18f7?q=80&w=2940&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80"></div>
                </div>
                <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Ready to Prioritize Your Health?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Book an appointment with {name} today. Early diagnosis and treatment are key to a healthy life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={handleBookClick} size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-10 h-14 text-lg font-bold shadow-xl">
                            Book Appointment Now
                        </Button>
                        <Button onClick={handleWhatsAppClick} variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-slate-900 rounded-full px-10 h-14 text-lg transition-colors">
                            Chat on WhatsApp
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: theme.gradient }}>
                                    {name.charAt(0)}
                                </div>
                                {name}
                            </div>
                            <p className="text-slate-500 leading-relaxed max-w-sm mb-6">
                                Providing world-class healthcare with a focus on patient comfort and advanced medical treatments.
                            </p>
                            <div className="flex gap-4">
                                <div onClick={() => handleSocialClick('Facebook')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors cursor-pointer" style={{ '--hover-bg': theme.primary } as any}>
                                    <Facebook className="w-5 h-5" />
                                </div>
                                <div onClick={() => handleSocialClick('LinkedIn')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors cursor-pointer" style={{ '--hover-bg': theme.primary } as any}>
                                    <Linkedin className="w-5 h-5" />
                                </div>
                                <div onClick={() => handleSocialClick('Instagram')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-colors cursor-pointer" style={{ '--hover-bg': theme.primary } as any}>
                                    <Instagram className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-slate-500">
                                <li><button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors">Home</button></li>
                                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About Us</button></li>
                                <li><button onClick={() => scrollToSection('services')} className="hover:text-primary transition-colors">Services</button></li>
                                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors">Testimonials</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
                            <ul className="space-y-3 text-slate-500">
                                <li className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0" style={{ color: theme.primary }} />
                                    <span>{location}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-primary shrink-0" style={{ color: theme.primary }} />
                                    <span>{phone}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-primary shrink-0" style={{ color: theme.primary }} />
                                    <span>Mon - Sat: 10am - 7pm</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
                        © 2025 {name}. All rights reserved. Powered by DocScale.
                    </div>
                </div>
            </footer>
            {/* Floating Demo Banner */}
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="bg-slate-900 text-white p-1 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-1 pr-2">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div className="text-sm font-medium">
                            Live Demo for <span className="font-bold text-white">{name}</span>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        style={{ backgroundColor: theme.primary, color: '#ffffff' }}
                        className="hover:opacity-90 rounded-lg h-10 px-4 font-bold shadow-lg ml-2"
                        onClick={() => window.location.href = "https://docscale.in/#contact"}
                    >
                        Claim This Site
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModernMedicalTemplate;
