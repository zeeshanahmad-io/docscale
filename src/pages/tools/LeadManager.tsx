import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Mail, MapPin, Phone, Star, RefreshCw, Search, Copy, Check, MessageCircle, Filter } from "lucide-react";
import leadsData from "@/data/leads.json";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// Define Lead type based on scraper output
interface Lead {
    name: string;
    rating: number;
    address: string;
    website: string | null;
    phone: string;
    city?: string;
    status: string;
    emailSent?: boolean;
    whatsappSent?: boolean;
    note?: string;
}

type LeadStatus = "New" | "In Progress" | "Call Scheduled" | "Closed" | "Not Interested";

const STATUS_COLORS: Record<LeadStatus, string> = {
    "New": "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Call Scheduled": "bg-purple-100 text-purple-800 border-purple-200",
    "Closed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "Not Interested": "bg-gray-100 text-gray-800 border-gray-200"
};

const EMAIL_TEMPLATES = {
    "broken_link": {
        subject: "Found a broken link on your Google Profile",
        body: (lead: Lead, demoLink: string) => `Hi Dr. ${lead.name.split(' ')[0] || 'Doctor'},

I'm a software engineer, not a salesperson. I was looking for a dentist in ${lead.address.split(',').pop()?.trim() || 'your area'} and noticed your website link on Google Maps is broken/missing.

This hurts your ranking and loses you patients every day.

I built a quick mockup of what your site *could* look like here:
${demoLink}

Want me to fix this for you?

Best,
Zeeshan`
    },
    "low_rating": {
        subject: "Quick tip for your Google Reviews",
        body: (lead: Lead, demoLink: string) => `Hi Dr. ${lead.name.split(' ')[0] || 'Doctor'},

I noticed you have a few negative reviews on Google Maps that are pulling down your rating.

I help clinics automate their reputation management to get more 5-star reviews.

I also mocked up a new website design for you here:
${demoLink}

Let me know if you're interested in fixing your online reputation.

Best,
Zeeshan`
    }
};

const LeadManager = () => {
    // Helper to detect city from address
    const detectCity = (address: string) => {
        const cityMappings: Record<string, string> = {
            // Mumbai Areas
            "Bandra": "Mumbai", "Andheri": "Mumbai", "Juhu": "Mumbai", "Powai": "Mumbai",
            "Worli": "Mumbai", "Colaba": "Mumbai", "Dadar": "Mumbai", "Thane": "Mumbai",
            "Navi Mumbai": "Mumbai", "Mumbai": "Mumbai",

            // Bangalore Areas
            "Indiranagar": "Bangalore", "Koramangala": "Bangalore", "Whitefield": "Bangalore",
            "HSR Layout": "Bangalore", "Bellandur": "Bangalore", "Jayanagar": "Bangalore",
            "Malleswaram": "Bangalore", "Yelahanka": "Bangalore", "Hebbal": "Bangalore",
            "Bengaluru": "Bangalore", "Bangalore": "Bangalore",

            // Other Major Cities
            "Delhi": "Delhi", "New Delhi": "Delhi",
            "Pune": "Pune",
            "Hyderabad": "Hyderabad",
            "Chennai": "Chennai",
            "Kolkata": "Kolkata",
            "Ahmedabad": "Ahmedabad"
        };

        for (const [key, city] of Object.entries(cityMappings)) {
            if (address.toLowerCase().includes(key.toLowerCase())) {
                return city;
            }
        }
        return "Unknown";
    };

    // Initialize leads from JSON, but check localStorage for updated statuses
    const [leads, setLeads] = useState<Lead[]>(() => {
        const storedData = localStorage.getItem("lead_data");
        const dataMap = storedData ? JSON.parse(storedData) : {};

        const cityMappings: Record<string, string> = {
            // Mumbai Areas
            "Bandra": "Mumbai", "Andheri": "Mumbai", "Juhu": "Mumbai", "Powai": "Mumbai",
            "Worli": "Mumbai", "Colaba": "Mumbai", "Dadar": "Mumbai", "Thane": "Mumbai",
            "Navi Mumbai": "Mumbai", "Mumbai": "Mumbai",

            // Bangalore Areas
            "Indiranagar": "Bangalore", "Koramangala": "Bangalore", "Whitefield": "Bangalore",
            "HSR Layout": "Bangalore", "Bellandur": "Bangalore", "Jayanagar": "Bangalore",
            "Malleswaram": "Bangalore", "Yelahanka": "Bangalore", "Hebbal": "Bangalore",
            "Bengaluru": "Bangalore", "Bangalore": "Bangalore",

            // Other Major Cities
            "Delhi": "Delhi", "New Delhi": "Delhi",
            "Pune": "Pune",
            "Hyderabad": "Hyderabad",
            "Chennai": "Chennai",
            "Kolkata": "Kolkata",
            "Ahmedabad": "Ahmedabad"
        };

        return (leadsData as Lead[]).map(lead => {
            let city = dataMap[lead.name]?.city;

            // Validate cached city. If it's not a known major city, re-detect it.
            const knownCityValues = Object.values(cityMappings);
            if (!city || !knownCityValues.includes(city)) {
                city = detectCity(lead.address);
            }

            return {
                ...lead,
                status: dataMap[lead.name]?.status || lead.status || "New",
                emailSent: dataMap[lead.name]?.emailSent || false,
                whatsappSent: dataMap[lead.name]?.whatsappSent || false,
                city: city
            };
        });
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | LeadStatus>("All");
    const [cityFilter, setCityFilter] = useState<string>("All"); // New state for city filter
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>("broken_link");
    const [emailDraft, setEmailDraft] = useState("");
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    // Extract unique cities
    const cities = Array.from(new Set(leads.map(l => l.city || "Unknown"))).sort();

    // Persist changes
    const updateLead = (leadName: string, updates: Partial<Lead>) => {
        const updatedLeads = leads.map(l =>
            l.name === leadName ? { ...l, ...updates } : l
        );
        setLeads(updatedLeads);

        // Save to localStorage
        const dataMap = updatedLeads.reduce((acc, curr) => ({
            ...acc,
            [curr.name]: {
                status: curr.status,
                emailSent: curr.emailSent,
                whatsappSent: curr.whatsappSent,
                city: curr.city // Include city in stored data
            }
        }), {});
        localStorage.setItem("lead_data", JSON.stringify(dataMap));
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
        const matchesCity = cityFilter === "All" || (lead.city || "Unknown") === cityFilter; // New city filter logic
        return matchesSearch && matchesStatus && matchesCity;
    });

    // Gamification Stats
    const totalLeads = leads.length;
    const contactedLeads = leads.filter(l => l.emailSent || l.whatsappSent).length;
    const progress = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;

    const generateDemoLink = (lead: Lead) => {
        const params = new URLSearchParams();
        params.append("name", lead.name);
        const specialty = lead.name.toLowerCase().includes('skin') ? 'dermatologist' :
            lead.name.toLowerCase().includes('heart') ? 'cardiologist' : 'dentist';
        params.append("specialty", specialty);
        const city = lead.city || lead.address.split(',').pop()?.trim() || "Mumbai"; // Use lead.city if available
        params.append("city", city);
        // Clean phone number (remove "Open", "Closes", etc.)
        const cleanPhone = lead.phone.replace(/Open.*?·|Closes.*?·/g, '').trim();
        params.append("phone", cleanPhone);
        params.append("location", lead.address);

        // Use window.location.origin to get full URL for email
        return `${window.location.origin}/demo/preview?${params.toString()}`;
    };

    const handleDraftEmail = (lead: Lead) => {
        setActiveLead(lead);
        const link = generateDemoLink(lead);
        setEmailDraft(EMAIL_TEMPLATES[selectedTemplate].body(lead, link));
    };

    const handleWhatsApp = (lead: Lead) => {
        const cleanPhone = lead.phone.replace(/[^0-9]/g, ''); // Strip non-numeric
        // Add country code if missing (assuming India +91)
        const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

        const link = generateDemoLink(lead);
        const text = `Hi Dr. ${lead.name.split(' ')[0]}, I made a website mockup for you: ${link}`;

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');

        // Auto-update status
        updateLead(lead.name, {
            whatsappSent: true,
            status: lead.status === "New" ? "In Progress" : lead.status
        });
        toast.success("Marked as WhatsApp Sent");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 font-sans text-foreground">
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
                        <Link to="/tools/demo-generator">
                            <Button variant="ghost">Demo Generator</Button>
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

            <div className="container mx-auto px-4">
                {/* Gamification Header */}
                <div className="mb-8 bg-card border rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Outreach Progress</h2>
                        <span className="text-sm text-muted-foreground">{contactedLeads} / {totalLeads} Contacted</span>
                    </div>
                    <Progress value={progress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                        {progress === 100 ? "🎉 Amazing! You've contacted everyone!" : "Keep going! Consistency is key."}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Manager (Sniper)</h1>
                        <p className="text-muted-foreground">
                            Manage and track your outreach pipeline.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search leads..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* City Filter Dropdown */}
                        <Select value={cityFilter} onValueChange={(val: any) => setCityFilter(val)}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <MapPin className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter City" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Cities</SelectItem>
                                {cities.map(city => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Statuses</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Call Scheduled">Call Scheduled</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                                <SelectItem value="Not Interested">Not Interested</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredLeads.length === 0 ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-muted-foreground mb-4">No leads found matching your filters.</p>
                                <Button variant="link" onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}>
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredLeads.map((lead, index) => (
                            <Card key={index} className={`flex flex-col md:flex-row items-start md:items-center p-4 gap-4 hover:shadow-md transition-shadow ${lead.status === 'Closed' ? 'border-emerald-500 bg-emerald-50/30' : ''}`}>
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg break-words w-full md:w-auto">{lead.name}</h3>

                                        {/* Status Dropdown */}
                                        <Select
                                            value={lead.status}
                                            onValueChange={(val: any) => updateLead(lead.name, { status: val })}
                                        >
                                            <SelectTrigger className={`h-6 text-xs w-auto border-0 px-2 ${STATUS_COLORS[lead.status as LeadStatus] || "bg-gray-100"}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="New">New</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Call Scheduled">Call Scheduled</SelectItem>
                                                <SelectItem value="Closed">Closed 🎉</SelectItem>
                                                <SelectItem value="Not Interested">Not Interested</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* Interaction Toggles */}
                                        <div className="flex items-center gap-1">
                                            <Badge
                                                variant={lead.emailSent ? "default" : "outline"}
                                                className={`cursor-pointer select-none ${lead.emailSent ? "bg-blue-500 hover:bg-blue-600 border-blue-500" : "text-muted-foreground hover:bg-muted"}`}
                                                onClick={() => updateLead(lead.name, { emailSent: !lead.emailSent })}
                                            >
                                                <Mail className="w-3 h-3 mr-1" />
                                                Email
                                            </Badge>
                                            <Badge
                                                variant={lead.whatsappSent ? "default" : "outline"}
                                                className={`cursor-pointer select-none ${lead.whatsappSent ? "bg-green-500 hover:bg-green-600 border-green-500" : "text-muted-foreground hover:bg-muted"}`}
                                                onClick={() => updateLead(lead.name, { whatsappSent: !lead.whatsappSent })}
                                            >
                                                <MessageCircle className="w-3 h-3 mr-1" />
                                                WA
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant={lead.rating < 3.5 ? "destructive" : "secondary"}>
                                                <Star className="w-3 h-3 mr-1 fill-current" />
                                                {lead.rating || "N/A"}
                                            </Badge>
                                            {!lead.website && (
                                                <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50 whitespace-nowrap">
                                                    No Website
                                                </Badge>
                                            )}
                                            {lead.note && (
                                                <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50 whitespace-nowrap">
                                                    {lead.note}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <div className="flex items-start">
                                            <MapPin className="w-3 h-3 mr-1 mt-1 flex-shrink-0" />
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + " " + lead.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline hover:text-blue-700 break-words"
                                            >
                                                {lead.address}
                                            </a>
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center">
                                                <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                                                <span>{lead.phone}</span>
                                            </div>
                                        )}
                                        {lead.website && (
                                            <div className="flex items-center">
                                                <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                                                    {lead.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                                    {/* WhatsApp Action */}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full sm:w-auto text-green-600 border-green-200 hover:bg-green-50"
                                        onClick={() => handleWhatsApp(lead)}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        WhatsApp
                                    </Button>

                                    <Link to={`/tools/demo-generator?name=${encodeURIComponent(lead.name)}&specialty=${lead.name.toLowerCase().includes('skin') ? 'dermatologist' : 'dentist'}&city=${encodeURIComponent(lead.address.split(',').pop()?.trim() || "Mumbai")}&phone=${encodeURIComponent(lead.phone)}&location=${encodeURIComponent(lead.address)}`} className="w-full sm:w-auto">
                                        <Button size="sm" className="w-full bg-primary text-primary-foreground">
                                            Generate Demo
                                        </Button>
                                    </Link>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => handleDraftEmail(lead)}>
                                                <Mail className="w-4 h-4 mr-2" />
                                                Draft Email
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Draft Email for {lead.name}</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-right">Template</Label>
                                                    <Select
                                                        value={selectedTemplate}
                                                        onValueChange={(val: any) => {
                                                            setSelectedTemplate(val);
                                                            if (activeLead) {
                                                                const link = generateDemoLink(activeLead);
                                                                setEmailDraft(EMAIL_TEMPLATES[val as keyof typeof EMAIL_TEMPLATES].body(activeLead, link));
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="col-span-3">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="broken_link">Broken Link Pitch</SelectItem>
                                                            <SelectItem value="low_rating">Low Rating Pitch</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label className="text-right">Subject</Label>
                                                    <div className="col-span-3 flex gap-2">
                                                        <Input value={EMAIL_TEMPLATES[selectedTemplate].subject} readOnly />
                                                        <Button size="icon" variant="ghost" onClick={() => copyToClipboard(EMAIL_TEMPLATES[selectedTemplate].subject)}>
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Body</Label>
                                                    <Textarea
                                                        value={emailDraft}
                                                        onChange={(e) => setEmailDraft(e.target.value)}
                                                        className="h-64 font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => {
                                                    copyToClipboard(emailDraft);
                                                    updateLead(activeLead!.name, {
                                                        emailSent: true,
                                                        status: activeLead!.status === "New" ? "In Progress" : activeLead!.status
                                                    });
                                                }}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy & Mark Contacted
                                                </Button>
                                                <Button variant="secondary" onClick={() => {
                                                    window.open(`mailto:?subject=${encodeURIComponent(EMAIL_TEMPLATES[selectedTemplate].subject)}&body=${encodeURIComponent(emailDraft)}`);
                                                    updateLead(activeLead!.name, {
                                                        emailSent: true,
                                                        status: activeLead!.status === "New" ? "In Progress" : activeLead!.status
                                                    });
                                                }}>
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    Open Mail Client
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadManager;
