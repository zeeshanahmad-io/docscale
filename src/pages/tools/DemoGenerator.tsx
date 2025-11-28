import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, ExternalLink, Check } from "lucide-react";
import demoData from "@/data/demoData.json";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const DemoGenerator = () => {
    const { toast } = useToast();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        name: searchParams.get("name") || "Dr. Anjali Desai",
        specialty: searchParams.get("specialty") || "dentist",
        city: searchParams.get("city") || "Mumbai",
        phone: searchParams.get("phone") || "+91 98765 43210",
        location: searchParams.get("location") || "Bandra West, Mumbai"
    });
    const [copied, setCopied] = useState(false);

    const specialties = Object.keys(demoData).filter(k => k !== 'default');

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const generateUrl = () => {
        const params = new URLSearchParams();
        if (formData.name) params.append("name", formData.name);
        if (formData.specialty) params.append("specialty", formData.specialty);
        if (formData.city) params.append("city", formData.city);
        if (formData.phone) params.append("phone", formData.phone);
        if (formData.location) params.append("location", formData.location);

        return `${window.location.origin}/demo/preview?${params.toString()}`;
    };

    const handleCopy = () => {
        const url = generateUrl();
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
            title: "Link Copied! 📋",
            description: "Paste this in your email to the doctor.",
        });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpen = () => {
        window.open(generateUrl(), '_blank');
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 font-sans text-foreground">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/logo.png" alt="DocScale Logo" className="h-8" width="32" height="32" />
                        <span className="text-xl font-bold">
                            <span className="text-primary">Doc</span>
                            <span className="text-foreground">Scale</span>
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link to="/tools/lead-manager">
                            <Button variant="ghost">Back to Leads</Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                                localStorage.removeItem("isAuthenticated");
                                window.location.reload();
                            }}
                        >
                            Log Out
                        </Button>
                        <Link to="/">
                            <Button variant="ghost">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto max-w-2xl px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                        Dynamic Demo Generator
                    </h1>
                    <p className="text-muted-foreground text-lg">Create personalized website mockups for outreach in seconds.</p>
                </div>

                <Card className="shadow-medium border-border bg-card">
                    <CardHeader className="border-b border-border pb-6 bg-secondary/30 rounded-t-xl">
                        <CardTitle className="text-foreground text-xl">Configuration</CardTitle>
                        <CardDescription className="text-muted-foreground">Enter the doctor's details below to customize the demo.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">Doctor / Clinic Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="e.g. Dr. Aditi Sharma"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialty" className="text-foreground">Specialty (Theme)</Label>
                                <Select
                                    value={formData.specialty}
                                    onValueChange={(value) => handleChange("specialty", value)}
                                >
                                    <SelectTrigger className="bg-background border-input text-foreground focus:ring-primary">
                                        <SelectValue placeholder="Select specialty" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border text-popover-foreground">
                                        {specialties.map(s => (
                                            <SelectItem key={s} value={s} className="focus:bg-accent focus:text-accent-foreground">
                                                {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-foreground">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleChange("city", e.target.value)}
                                    placeholder="e.g. Mumbai"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    placeholder="e.g. +91 98765 43210"
                                    className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-foreground">Full Location (Footer)</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange("location", e.target.value)}
                                placeholder="e.g. Bandra West, Mumbai"
                                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={handleOpen}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 shadow-soft"
                                size="lg"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Preview
                            </Button>
                            <Button
                                onClick={handleCopy}
                                variant="outline"
                                className="flex-1 border-border text-foreground hover:bg-secondary hover:text-foreground h-12"
                                size="lg"
                            >
                                {copied ? <Check className="w-4 h-4 mr-2 text-success" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? "Copied!" : "Copy Link"}
                            </Button>
                        </div>

                        <div className="mt-6 p-4 bg-muted rounded-lg border border-border text-xs text-muted-foreground break-all font-mono">
                            {generateUrl()}
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DemoGenerator;
