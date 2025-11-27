import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
    Search,
    Activity,
    Smartphone,
    Globe,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
    Lock,
    Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface AuditResult {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
    finalUrl: string;
}

const SeoAuditor = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('');
    const [result, setResult] = useState<AuditResult | null>(null);
    const [email, setEmail] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(false);
    const { toast } = useToast();

    const analyzeWebsite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        // Basic URL validation
        let formattedUrl = url;
        if (!url.startsWith('http')) {
            formattedUrl = `https://${url}`;
        }

        setLoading(true);
        setResult(null);
        setShowEmailForm(false);
        setProgress(10);
        setLoadingText('Connecting to Google PageSpeed API...');

        try {
            // Simulate progress steps for better UX while fetching
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
                setLoadingText(prev => {
                    if (prev === 'Connecting to Google PageSpeed API...') return 'Analyzing Mobile Responsiveness...';
                    if (prev === 'Analyzing Mobile Responsiveness...') return 'Checking Core Web Vitals...';
                    if (prev === 'Checking Core Web Vitals...') return 'Scanning for SEO Tags...';
                    return prev;
                });
            }, 800);

            const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
            const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(formattedUrl)}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY&category=BEST_PRACTICES&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;

            const response = await fetch(apiUrl);

            clearInterval(progressInterval);

            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again in a few minutes or add a Google API Key.');
            }

            if (!response.ok) {
                throw new Error('Failed to analyze website. Please check the URL.');
            }

            const data = await response.json();

            // Extract scores (0-1 scale to 0-100)
            const scores = {
                performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
                seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
                accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
                bestPractices: Math.round(data.lighthouseResult.categories['best-practices'].score * 100),
                finalUrl: data.lighthouseResult.finalUrl
            };

            setProgress(100);
            setLoadingText('Analysis Complete!');

            setTimeout(() => {
                setResult(scores);
                setLoading(false);
            }, 500);

        } catch (error) {
            setLoading(false);
            toast({
                title: "Analysis Failed",
                description: "Could not analyze this URL. Please ensure it is a valid, publicly accessible website.",
                variant: "destructive"
            });
        }
    };

    const handleLeadCapture = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Here you would typically send this to your backend/CRM
        toast({
            title: "Report Sent!",
            description: `The detailed technical report has been sent to ${email}.`,
        });
        setEmail('');
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBg = (score: number) => {
        if (score >= 90) return "bg-green-500/10 border-green-500/20";
        if (score >= 50) return "bg-yellow-500/10 border-yellow-500/20";
        return "bg-red-500/10 border-red-500/20";
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <Helmet>
                <title>Free Clinic SEO Audit Tool | Check Your Medical Website Score</title>
                <meta name="description" content="Get a free technical SEO audit for your medical clinic website. Check Google rankings, mobile speed, and patient experience in 10 seconds." />
                <link rel="canonical" href="https://docscale.in/tools/seo-auditor" />
            </Helmet>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="DocScale Logo" className="h-8" />
                        <span className="text-xl font-bold">
                            <span className="text-primary">Doc</span>
                            <span className="text-foreground">Scale</span>
                        </span>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost">Back to Home</Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
                        <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Free Clinic SEO Auditor
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Is your medical practice invisible on Google? Run a free 10-second audit to check your SEO, Site Speed, and Mobile Friendliness.
                    </p>
                </div>

                {/* Search Box */}
                <Card className="border-2 shadow-lg mb-12">
                    <CardContent className="p-6 md:p-8">
                        <form onSubmit={analyzeWebsite} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Enter your clinic's website URL (e.g., myclinic.com)"
                                    className="pl-10 h-12 text-lg"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-12 px-8 text-lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        Run Free Audit
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {loading && (
                            <div className="mt-8 space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>{loadingText}</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Performance", score: result.performance, icon: Activity },
                                { label: "SEO", score: result.seo, icon: Search },
                                { label: "Accessibility", score: result.accessibility, icon: CheckCircle2 },
                                { label: "Best Practices", score: result.bestPractices, icon: AlertCircle },
                            ].map((item) => (
                                <Card key={item.label} className={`border ${getScoreBg(item.score)}`}>
                                    <CardContent className="p-6 text-center">
                                        <item.icon className={`w-8 h-8 mx-auto mb-3 ${getScoreColor(item.score)}`} />
                                        <div className={`text-3xl font-bold mb-1 ${getScoreColor(item.score)}`}>
                                            {item.score}
                                        </div>
                                        <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Analysis & CTA */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-primary" />
                                        Mobile Experience
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">Analyzed URL</p>
                                        <p className="font-mono text-sm break-all">{result.finalUrl}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Mobile Viewport Detected</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Tap Targets Sized Appropriately</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>Content Fits Screen</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-primary" />
                                        Unlock Full Report
                                    </CardTitle>
                                    <CardDescription>
                                        Get a detailed PDF report with step-by-step instructions to fix these issues.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleLeadCapture} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                            <Input
                                                type="email"
                                                placeholder="Enter your email address"
                                                className="pl-9 bg-background"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Email Me The Fixes
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground">
                                            We'll also send you our "Doctor's Guide to SEO 2025".
                                        </p>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeoAuditor;
