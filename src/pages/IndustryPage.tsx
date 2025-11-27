
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Calendar, Sparkles } from "lucide-react";
import programmaticData from "@/data/programmaticData.json";

interface IndustryPageProps {
    specialtyId?: string;
    cityId?: string;
}

const IndustryPage = ({ specialtyId: propSpecialtyId, cityId: propCityId }: IndustryPageProps) => {
    const { specialtyId: paramSpecialtyId, cityId: paramCityId } = useParams<{ specialtyId: string; cityId: string }>();

    const specialtyId = propSpecialtyId || paramSpecialtyId;
    const cityId = propCityId || paramCityId;

    const specialty = programmaticData.specialties.find(s => s.id === specialtyId);
    const city = programmaticData.cities.find(c => c.id === cityId);

    if (!specialty || !city) {
        return <Navigate to="/" replace />;
    }

    const title = `Digital Marketing for ${specialty.plural} in ${city.label} | DocScale`;
    const description = `Attract more patients to your ${specialty.label} practice in ${city.label}. Expert SEO, Google Ads, and Website Design tailored for ${specialty.plural}.`;

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={`https://docscale.in/marketing-for-${specialtyId}-in-${cityId}`} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={`https://docscale.in/marketing-for-${specialtyId}-in-${cityId}`} />
            </Helmet>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto max-w-6xl text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm">
                        For {specialty.plural} in {city.label}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                        Get More <span className="text-primary">{specialty.label} Patients</span> in {city.label}
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Stop relying on referrals. We help {specialty.plural} in {city.label} rank #1 on Google and fill their appointment calendars.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/#contact">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-12">
                                Get Free Strategy for {city.label}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/#services">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-12">
                                View Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Problem/Solution Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                Why {specialty.plural} in {city.label} Need Digital Marketing
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Patients in {city.label} are searching for "{specialty.label} near me" every day. If you aren't on the first page of Google, you are losing them to your competitors.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    `Rank for "${specialty.label} in ${city.label}" keywords`,
                                    "Build a 5-star reputation on Google & Practo",
                                    "Automate patient appointment booking",
                                    "AI Search Optimization (ChatGPT & Perplexity)",
                                    "High-converting website design"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        {item.includes("AI") ? (
                                            <Sparkles className="w-5 h-5 text-primary shrink-0" />
                                        ) : (
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        )}
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-muted rounded-2xl p-8 border border-border">
                            <h3 className="text-xl font-semibold mb-6">Projected Growth in {city.label}</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">30-50 New Patients/Month</div>
                                        <div className="text-sm text-muted-foreground">Average growth for {specialty.plural}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">300% ROI</div>
                                        <div className="text-sm text-muted-foreground">On marketing spend within 6 months</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Full Calendar</div>
                                        <div className="text-sm text-muted-foreground">Consistent bookings, zero gaps</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tailored Services Section */}
            <section className="py-20 px-4 bg-muted/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Tailored Marketing Solutions for {specialty.plural}</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We don't use generic strategies. Our entire marketing stack is built specifically for {specialty.label} clinics in {city.label}.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{specialty.label} SEO Services</h3>
                            <p className="text-muted-foreground">
                                Rank for high-intent keywords like "best {specialty.label} in {city.label}" and "top {specialty.label} clinic near me".
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Google Ads for {specialty.plural}</h3>
                            <p className="text-muted-foreground">
                                Get instant patient inquiries with targeted PPC campaigns designed to capture people actively looking for {specialty.label} services.
                            </p>
                        </div>
                        <div className="bg-background p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Website Design for {specialty.label} Clinics</h3>
                            <p className="text-muted-foreground">
                                Convert visitors into patients with a fast, mobile-friendly website that highlights your expertise and patient testimonials.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-primary text-primary-foreground">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Dominate the {specialty.label} Market in {city.label}?
                    </h2>
                    <p className="text-xl opacity-90 mb-8">
                        We only work with one {specialty.label} per area in {city.label} to ensure exclusive results.
                    </p>
                    <Link to="/#contact">
                        <Button size="lg" variant="secondary" className="text-lg px-8 h-12">
                            Claim Your Spot in {city.label}
                        </Button>
                    </Link>
                </div>
            </section>
        </div >
    );
};

export default IndustryPage;
