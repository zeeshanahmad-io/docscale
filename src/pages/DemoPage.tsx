
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, CheckCircle2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import demoData from "@/data/demoData.json";
import { Helmet } from "react-helmet-async";

const DemoPage = () => {
    const [searchParams] = useSearchParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // URL Params with Defaults
    const name = searchParams.get("name") || "Dr. Faiyaz Ahmad";
    const specialty = searchParams.get("specialty")?.toLowerCase() || "neurologist";
    const city = searchParams.get("city") || "Patna";
    const phone = searchParams.get("phone") || "+91 98765 43210";
    const location = searchParams.get("location") || `Raja Bazar, ${city}`;

    // Get data based on specialty or fall back to default
    // @ts-ignore
    const data = demoData[specialty] || demoData["default"];
    const theme = data.theme || demoData["default"].theme;

    // Capitalize helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const specialtyLabel = capitalize(specialty.replace('-', ' '));

    // Font loading
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const scrollToServices = () => {
        const element = document.getElementById('services');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Helmet>
                <title>{name} - Best {specialtyLabel} in {city}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Top Bar */}
            <div className="bg-slate-950 text-white py-3 px-4 text-sm hidden md:block">
                <div className="container mx-auto max-w-6xl flex justify-between items-center">
                    <div className="flex gap-8">
                        <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/70" /> {phone}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/70" /> {location}</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/70" /> Mon - Sat: 10:00 AM - 7:00 PM</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-50 shadow-sm">
                <div className="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-slate-950 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {name}
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                        <a href="#home" className="hover:text-slate-900 transition-colors">Home</a>
                        <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
                        <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
                        <Button
                            style={{ backgroundColor: theme.primary, color: '#ffffff' }}
                            className="hover:opacity-90 rounded-full px-8 shadow-md transition-transform hover:scale-105"
                        >
                            Book Appointment
                        </Button>
                    </div>
                    <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
                        <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
                        <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
                        <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
                        <Button style={{ backgroundColor: theme.primary, color: '#ffffff' }} className="w-full">Book Appointment</Button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent z-10"></div>
                    <img src={data.heroImage} alt="Doctor Hero" className="w-full h-full object-cover object-center" />
                </div>

                <div className="container mx-auto max-w-6xl px-4 relative z-20">
                    <div className="max-w-2xl animate-in slide-in-from-left-10 duration-700 fade-in">
                        <div
                            style={{ backgroundColor: theme.primary, color: '#ffffff' }}
                            className="inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wide mb-6 shadow-sm"
                        >
                            #1 RATED {specialtyLabel.toUpperCase()} IN {city.toUpperCase()}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-950 mb-6 leading-[1.1]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Expert Care for <br />
                            <span style={{ color: theme.accent }}>Your Health</span>
                        </h1>
                        <p className="text-xl text-slate-700 mb-10 leading-relaxed font-medium">
                            {name} provides world-class {specialtyLabel.toLowerCase()} care with a patient-first approach.
                            Advanced treatments, compassionate care, and proven results.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                style={{ backgroundColor: theme.primary, color: '#ffffff' }}
                                className="hover:opacity-90 rounded-full px-10 h-14 text-lg font-semibold shadow-lg"
                            >
                                Book Consultation
                            </Button>
                            <Button onClick={scrollToServices} variant="outline" size="lg" className="rounded-full px-10 h-14 text-lg border-2 border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all bg-white/80 backdrop-blur-sm">
                                View Services
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{ backgroundColor: theme.primary }} className="py-16 text-white">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid grid-cols-3 gap-8 text-center divide-x divide-white/20">
                        {data.stats.map((stat: any, index: number) => (
                            <div key={index} className="group">
                                <div className="text-4xl md:text-6xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</div>
                                <div className="text-white/90 text-sm md:text-base font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 bg-slate-50">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div
                                style={{ backgroundColor: theme.primary }}
                                className="absolute -top-4 -left-4 w-24 h-24 opacity-10 rounded-tl-3xl"
                            ></div>
                            <img src={data.aboutImage} alt="About Doctor" className="rounded-2xl shadow-xl w-full relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-950 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Meet {name}
                            </h2>
                            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                                With over {data.stats[2].value} years of experience, {name} is a renowned {specialtyLabel} in {city}.
                                Dedicated to providing personalized care, {name} combines medical expertise with a compassionate approach.
                            </p>
                            <div className="grid grid-cols-2 gap-6 mt-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <div style={{ color: theme.accent }} className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: theme.accent }}>MBBS, MD</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualification</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <div style={{ color: theme.accent }} className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: theme.accent }}>10k+</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consultations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-white">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-950 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Specialized Treatments
                        </h2>
                        <p className="text-xl text-slate-600">
                            Comprehensive care tailored to your specific needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {data.services.map((service: any, index: number) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group hover:border-slate-200">
                                <div
                                    style={{ backgroundColor: theme.secondary }}
                                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"
                                >
                                    <CheckCircle2 style={{ color: theme.accent }} className="w-7 h-7 transition-colors duration-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{service.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-900 text-white text-center">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Ready to Prioritize Your Health?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10">
                        Book an appointment with {name} today. Early diagnosis and treatment are key.
                    </p>
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-12 h-16 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                        Book Appointment Now
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
                <div className="container mx-auto max-w-6xl px-4 text-center">
                    <div className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{name}</div>
                    <p className="mb-8 text-lg">{location} | {phone}</p>
                    <div className="text-sm opacity-60">© 2025 {name}. Powered by DocScale.</div>
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

export default DemoPage;
