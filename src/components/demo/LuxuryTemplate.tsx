import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Clock, ArrowRight, Star, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface LuxuryTemplateProps {
    data: any;
    theme: any;
    name: string;
    specialtyLabel: string;
    city: string;
    phone: string;
    location: string;
}

const LuxuryTemplate = ({ data, theme, name, specialtyLabel, city, phone, location }: LuxuryTemplateProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { toast } = useToast();

    // Use specialty color as the primary accent, but keep the base dark/premium
    const accentColor = theme.primary;

    // Font loading
    useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleBookClick = () => {
        toast({
            title: "Premium Booking Request",
            description: "This would open the priority booking calendar.",
            duration: 3000,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-slate-900 selection:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>{name} | Exclusive {specialtyLabel} Care</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Floating Nav Dock */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="bg-white/80 backdrop-blur-md border border-white/20 shadow-2xl rounded-full px-6 py-3 flex items-center gap-8 max-w-4xl w-full justify-between">
                    <div className="text-xl font-bold tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {name.split(' ').map((n, i) => i === 1 ? <span key={i} style={{ color: accentColor }}>{n}</span> : <span key={i} className="mr-1">{n}</span>)}
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#home" className="hover:text-slate-900 transition-colors">Home</a>
                        <a href="#expertise" className="hover:text-slate-900 transition-colors">Expertise</a>
                        <a href="#experience" className="hover:text-slate-900 transition-colors">Experience</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest hover:text-slate-900 transition-colors">
                            <Phone className="w-3 h-3" /> {phone}
                        </a>
                        <Button
                            onClick={handleBookClick}
                            className="rounded-full px-6 h-10 text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                            style={{ backgroundColor: accentColor, color: '#fff' }}
                        >
                            Book Visit
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/20 to-slate-900 z-10"></div>
                    <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover opacity-60 scale-105 animate-in fade-in duration-1000" />
                </div>

                <div className="relative z-20 container mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium tracking-widest uppercase">Premier {specialtyLabel} in {city}</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-medium mb-8 leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Redefining <br />
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Excellence</span>
                    </h1>

                    <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-12 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
                        Experience world-class healthcare tailored to your unique needs.
                        Where advanced medicine meets compassionate luxury.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
                        <Button
                            onClick={handleBookClick}
                            size="lg"
                            className="h-14 px-10 rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform bg-white text-slate-900 hover:bg-slate-100"
                        >
                            Schedule Consultation
                        </Button>
                        <a href="#expertise" className="group flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                            Explore Services <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Expertise Grid */}
            <section id="expertise" className="py-32 bg-white relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-medium mb-6 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Curated Medical Expertise
                            </h2>
                            <p className="text-slate-500 text-lg font-light">
                                Specialized treatments delivered with precision and care.
                            </p>
                        </div>
                        <div className="h-px bg-slate-200 flex-1 ml-8 hidden md:block"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-px bg-slate-100 border border-slate-100">
                        {data.services.map((service: any, index: number) => (
                            <div key={index} className="bg-white p-12 hover:bg-slate-50 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-0 bg-slate-900 group-hover:h-full transition-all duration-500" style={{ backgroundColor: accentColor }}></div>
                                <h3 className="text-2xl font-medium mb-4 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{service.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-8 font-light">
                                    {service.description}
                                </p>
                                <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 group-hover:translate-x-2 transition-transform">
                                    Learn More <ArrowRight className="w-3 h-3 ml-2" />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience / About */}
            <section id="experience" className="py-32 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 md:order-1">
                            <div className="aspect-[4/5] overflow-hidden rounded-sm">
                                <img src={data.aboutImage} alt="Doctor" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                            </div>
                            <div className="absolute -bottom-12 -right-12 bg-white p-12 shadow-2xl max-w-xs hidden md:block">
                                <div className="text-5xl font-medium mb-2 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{data.stats[2].value}</div>
                                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Years of Excellence</div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <div className="inline-block px-3 py-1 border border-slate-200 rounded-full text-xs font-medium uppercase tracking-widest text-slate-500 mb-8">
                                The Physician
                            </div>
                            <h2 className="text-5xl md:text-6xl font-medium mb-8 text-slate-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {name}
                            </h2>
                            <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">
                                "My philosophy is simple: every patient deserves not just treatment, but a transformation. We combine state-of-the-art technology with a deeply personal touch."
                            </p>

                            <div className="grid grid-cols-2 gap-12 border-t border-slate-200 pt-12">
                                <div>
                                    <div className="text-3xl font-medium mb-1 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{data.stats[1].value}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Happy Patients</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-medium mb-1 text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{data.stats[0].value}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="bg-slate-900 text-white py-24 border-t border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-medium mb-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Begin Your Journey
                    </h2>
                    <Button
                        onClick={handleBookClick}
                        size="lg"
                        className="h-16 px-12 rounded-full text-sm font-bold uppercase tracking-widest bg-white text-slate-900 hover:bg-slate-200 mb-16"
                    >
                        Book Appointment
                    </Button>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/10 text-sm text-slate-400 font-light">
                        <div>&copy; 2025 {name}. All rights reserved.</div>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <span>{location}</span>
                            <span>{phone}</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Demo Banner */}
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
                <div className="bg-white/90 backdrop-blur-md text-slate-900 p-1 rounded-xl shadow-2xl border border-slate-200 flex items-center gap-1 pr-2">
                    <div className="bg-slate-100 rounded-lg px-4 py-3 flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <div className="text-sm font-medium">
                            Luxury Demo for <span className="font-bold">{name}</span>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        style={{ backgroundColor: accentColor, color: '#ffffff' }}
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

export default LuxuryTemplate;
