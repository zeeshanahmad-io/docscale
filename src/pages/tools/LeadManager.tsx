import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Mail, MapPin, Phone, Star, RefreshCw, Search, Copy, Check, MessageCircle, Filter, Loader2, AlertTriangle, Terminal, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import programmaticData from "@/data/programmaticData.json";

// Define Lead type based on Supabase schema
interface Lead {
    id: number;
    name: string;
    rating: number;
    address: string;
    website: string | null;
    phone: string;
    city?: string;
    status: string;
    email_sent: boolean;
    whatsapp_sent: boolean;
    note?: string;
    specialty?: string;
}

type LeadStatus = "New" | "In Progress" | "Call Scheduled" | "Closed" | "Not Interested";

const STATUS_COLORS: Record<string, string> = {
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

I'm a software engineer, not a salesperson. I was looking for a dentist in ${lead.city || 'your area'} and noticed your website link on Google Maps is broken/missing.

This hurts your ranking and loses you patients every day.

I built a quick mockup of what your site *could* look like here:
${demoLink}

Want me to fix this for you?

Best,
Zeeshan (docscale.in)`
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
Zeeshan (docscale.in)`
    }
};

const LeadManager = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [cityFilter, setCityFilter] = useState("All");
    const [specialtyFilter, setSpecialtyFilter] = useState("All");
    const [issueFilter, setIssueFilter] = useState("All");

    // Email Draft State
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>("broken_link");
    const [emailDraft, setEmailDraft] = useState("");
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    // Helper to detect specialty from name
    const detectSpecialty = (name: string) => {
        const lowerName = name.toLowerCase();

        // Map common keywords to specialties
        if (lowerName.includes('dent') || lowerName.includes('smile') || lowerName.includes('tooth') || lowerName.includes('teeth')) return 'Dentist';
        if (lowerName.includes('skin') || lowerName.includes('derma') || lowerName.includes('hair') || lowerName.includes('cosmetic')) return 'Dermatologist';
        if (lowerName.includes('eye') || lowerName.includes('vision') || lowerName.includes('retina') || lowerName.includes('ophthal')) return 'Ophthalmologist';
        if (lowerName.includes('ortho') || lowerName.includes('bone') || lowerName.includes('joint') || lowerName.includes('spine')) return 'Orthopedic Surgeon';
        if (lowerName.includes('heart') || lowerName.includes('cardio')) return 'Cardiologist';
        if (lowerName.includes('kidney') || lowerName.includes('nephro')) return 'Nephrologist';
        if (lowerName.includes('neuro') || lowerName.includes('brain') || lowerName.includes('nerve')) return 'Neurologist';
        if (lowerName.includes('woman') || lowerName.includes('gyn') || lowerName.includes('ivf') || lowerName.includes('fertility')) return 'Gynecologist';
        if (lowerName.includes('child') || lowerName.includes('pedia') || lowerName.includes('baby')) return 'Pediatrician';
        if (lowerName.includes('physio') || lowerName.includes('rehab')) return 'Physiotherapist';
        if (lowerName.includes('mind') || lowerName.includes('psych')) return 'Psychiatrist';
        if (lowerName.includes('ent') || lowerName.includes('ear') || lowerName.includes('nose') || lowerName.includes('throat')) return 'ENT Specialist';
        if (lowerName.includes('physician') || lowerName.includes('general') || lowerName.includes('family') || lowerName.includes('consultant')) return 'General Physician';

        return 'Unknown'; // Default fallback
    };

    // Helper to detect city from address
    const detectCity = (address: string, currentCity?: string) => {
        const cityMappings: Record<string, string> = {
            // Mumbai Areas
            "Bandra": "Mumbai", "Andheri": "Mumbai", "Juhu": "Mumbai", "Powai": "Mumbai",
            "Worli": "Mumbai", "Colaba": "Mumbai", "Dadar": "Mumbai", "Thane": "Mumbai",
            "Navi Mumbai": "Mumbai", "Mumbai": "Mumbai", "Santacruz": "Mumbai", "Khar": "Mumbai",
            "Malad": "Mumbai", "Goregaon": "Mumbai", "Borivali": "Mumbai", "Kandivali": "Mumbai",
            "Vashi": "Mumbai", "Panvel": "Mumbai", "Kalyan": "Mumbai", "Dombivli": "Mumbai",
            "Vasai": "Mumbai", "Virar": "Mumbai", "Mira Road": "Mumbai", "Bhayandar": "Mumbai",
            "Ulhasnagar": "Mumbai", "Bhiwandi": "Mumbai", "Chembur": "Mumbai", "Ghatkopar": "Mumbai",
            "Mulund": "Mumbai", "Kurla": "Mumbai", "Sakinaka": "Mumbai", "Versova": "Mumbai",
            "Dahisar": "Mumbai", "Jogeshwari": "Mumbai", "Vile Parle": "Mumbai", "Sion": "Mumbai",

            // Bangalore Areas
            "Indiranagar": "Bangalore", "Koramangala": "Bangalore", "Whitefield": "Bangalore",
            "HSR Layout": "Bangalore", "Bellandur": "Bangalore", "Jayanagar": "Bangalore",
            "Malleswaram": "Bangalore", "Yelahanka": "Bangalore", "Hebbal": "Bangalore",
            "Bengaluru": "Bangalore", "Bangalore": "Bangalore", "Marathahalli": "Bangalore",
            "Electronic City": "Bangalore", "BTM Layout": "Bangalore", "JP Nagar": "Bangalore",
            "Banashankari": "Bangalore", "Vijayanagar": "Bangalore", "Basavanagudi": "Bangalore",
            "Frazer Town": "Bangalore", "Cooke Town": "Bangalore", "Benson Town": "Bangalore",
            "Ulsoor": "Bangalore", "Domlur": "Bangalore", "Kasturi Nagar": "Bangalore",
            "Kalyan Nagar": "Bangalore", "Kammanahalli": "Bangalore", "Banaswadi": "Bangalore",
            "Peenya": "Bangalore", "Yeshwanthpur": "Bangalore", "Rajajinagar": "Bangalore",
            "RT Nagar": "Bangalore", "Sadashivnagar": "Bangalore", "Sahakara Nagar": "Bangalore",
            "Hennur": "Bangalore", "Kothanur": "Bangalore",

            // Other Major Cities
            "Delhi": "Delhi", "New Delhi": "Delhi", "Gurgaon": "Delhi", "Noida": "Delhi",
            "Pune": "Pune", "Hinjewadi": "Pune", "Viman Nagar": "Pune",
            "Hyderabad": "Hyderabad", "Gachibowli": "Hyderabad", "Jubilee Hills": "Hyderabad",
            "Chennai": "Chennai",
            "Kolkata": "Kolkata",
            "Ahmedabad": "Ahmedabad"
        };

        // Check if the current city is already a valid major city (Trust the scraper/DB)
        if (currentCity) {
            // Check against hardcoded mappings
            if (Object.values(cityMappings).includes(currentCity)) return currentCity;

            // Check against master list
            const masterCity = programmaticData.cities.find(c => c.label.toLowerCase() === currentCity.toLowerCase());
            if (masterCity) return masterCity.label;
        }

        // 1. Try to detect from hardcoded mappings
        for (const [key, city] of Object.entries(cityMappings)) {
            if (address.toLowerCase().includes(key.toLowerCase())) {
                return city;
            }
        }

        // 2. Try to detect from programmaticData (Master List)
        for (const cityData of programmaticData.cities) {
            if (address.toLowerCase().includes(cityData.label.toLowerCase())) {
                return cityData.label;
            }
        }

        return "Unknown";
    };

    // Fetch leads from Supabase
    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast.error("Failed to fetch leads");
            console.error(error);
        } else {
            // Normalize cities and specialties on fetch
            const normalizedLeads = (data || []).map((lead: Lead) => ({
                ...lead,
                city: detectCity(lead.address, lead.city),
                specialty: detectSpecialty(lead.name)
            }));
            setLeads(normalizedLeads);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateLeadStatus = async (id: number, newStatus: string) => {
        // Optimistic update
        const oldLeads = [...leads];
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));

        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            setLeads(oldLeads); // Revert
            toast.error("Failed to update status");
        } else {
            toast.success(`Status updated to ${newStatus}`);
        }
    };

    const toggleInteraction = async (id: number, field: 'email_sent' | 'whatsapp_sent') => {
        const lead = leads.find(l => l.id === id);
        if (!lead) return;

        const newValue = !lead[field];
        let newStatus = lead.status;

        // Auto-update status to "In Progress" if currently "New" and marking as sent
        if (newValue && lead.status === "New") {
            newStatus = "In Progress";
        }

        // Optimistic update
        const oldLeads = [...leads];
        setLeads(leads.map(l => l.id === id ? { ...l, [field]: newValue, status: newStatus } : l));

        const updates: any = { [field]: newValue };
        if (newStatus !== lead.status) {
            updates.status = newStatus;
        }

        const { error } = await supabase
            .from('leads')
            .update(updates)
            .eq('id', id);

        if (error) {
            setLeads(oldLeads); // Revert
            toast.error("Failed to update interaction");
        } else if (newStatus !== lead.status) {
            toast.success("Status updated to In Progress");
        }
    };

    const deleteLead = async (id: number) => {
        const oldLeads = [...leads];
        setLeads(leads.filter(l => l.id !== id));

        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (error) {
            setLeads(oldLeads); // Revert
            toast.error("Failed to delete lead");
        } else {
            toast.success("Lead deleted successfully");
        }
    };

    // Get unique cities for filter
    const cities = Array.from(new Set(leads.map(l => l.city).filter(Boolean))).sort();

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.address?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
        const matchesCity = cityFilter === "All" || (lead.city || "Unknown") === cityFilter;
        const matchesSpecialty = specialtyFilter === "All" || (lead.specialty || "Unknown") === specialtyFilter;

        let matchesIssue = true;
        if (issueFilter === "No Website") matchesIssue = !lead.website;
        if (issueFilter === "Low Rating") matchesIssue = lead.rating < 3.5;
        if (issueFilter === "Broken Link") matchesIssue = lead.note?.toLowerCase().includes("broken") || false;

        return matchesSearch && matchesStatus && matchesCity && matchesSpecialty && matchesIssue;
    });

    // Gamification Stats
    const totalLeads = leads.length;
    const contactedLeads = leads.filter(l => l.email_sent || l.whatsapp_sent).length;
    const progress = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0;

    const generateDemoLink = (lead: Lead) => {
        const params = new URLSearchParams();
        params.set("businessName", lead.name);
        if (lead.city) params.set("city", lead.city);
        const specialty = lead.name.toLowerCase().includes('skin') ? 'dermatologist' :
            lead.name.toLowerCase().includes('heart') ? 'cardiologist' : 'dentist';
        params.append("specialty", specialty);
        const city = lead.city || "Mumbai";
        params.append("city", city);
        // STRICTLY clean phone number: remove everything except digits and +
        const cleanPhone = lead.phone.replace(/[^\d+]/g, '').trim();
        params.append("phone", cleanPhone);
        params.append("location", lead.address);

        return `${window.location.origin}/demo/preview?${params.toString()}`;
    };

    const handleDraftEmail = (lead: Lead) => {
        setActiveLead(lead);
        const link = generateDemoLink(lead);
        setEmailDraft(EMAIL_TEMPLATES[selectedTemplate].body(lead, link));
    };

    const handleWhatsApp = (lead: Lead) => {
        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
        const phone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

        const link = generateDemoLink(lead);
        let text = "";

        if (!lead.website) {
            text = `Hi Dr. ${lead.name.split(' ')[0]}, I noticed you don't have a website for ${lead.name}. Patients in ${lead.city || 'your area'} are searching for you but finding competitors.

I've built a preview of what your site could look like: ${link}

See how much revenue you might be losing here: https://docscale.in

- Zeeshan (docscale.in)`;
        } else if (lead.rating < 3.5) {
            text = `Hi Dr. ${lead.name.split(' ')[0]}, I noticed ${lead.name} has a rating of ${lead.rating}. Patients in ${lead.city || 'your area'} often skip clinics with low ratings.

I've built a preview of a new site that helps automate 5-star reviews: ${link}

See how we help doctors rank #1 on Google: https://docscale.in

- Zeeshan (docscale.in)`;
        } else {
            text = `Hi Dr. ${lead.name.split(' ')[0]}, I noticed your current site might be missing out on patients in ${lead.city || 'your area'}.

I've built a preview of a high-converting website for ${lead.name}: ${link}

See how much revenue you might be losing here: https://docscale.in

- Zeeshan (docscale.in)`;
        }

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');

        // Auto-update status handled by toggleInteraction
        toggleInteraction(lead.id, 'whatsapp_sent');
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
                {/* Scraper Helper */}
                <div className="mb-6 bg-muted/30 border border-dashed border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-primary mb-1 flex items-center">
                            <Terminal className="w-4 h-4 mr-2" />
                            Run Scraper
                        </h3>
                        <code className="text-xs bg-background px-2 py-1 rounded border font-mono text-muted-foreground block sm:inline-block">
                            node scripts/scrape-leads.js "Dentist in Bandra"
                        </code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard('node scripts/scrape-leads.js "Dentist in Bandra"')}>
                        <Copy className="w-3 h-3 mr-2" />
                        Copy Command
                    </Button>
                </div>

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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Manager</h1>
                        <p className="text-muted-foreground">
                            Showing <span className="font-medium text-foreground">{filteredLeads.length}</span> of <span className="font-medium text-foreground">{totalLeads}</span> leads.
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
                                {cities.map((city: any) => (
                                    <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Specialty Filter Dropdown */}
                        <Select value={specialtyFilter} onValueChange={(val: any) => setSpecialtyFilter(val)}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <Star className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter Specialty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Specialties</SelectItem>
                                <SelectItem value="Unknown">Unknown</SelectItem>
                                {programmaticData.specialties.map((spec: any) => (
                                    <SelectItem key={spec.label} value={spec.label}>{spec.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Issue Filter Dropdown */}
                        <Select value={issueFilter} onValueChange={(val: any) => setIssueFilter(val)}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Filter Issue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Issues</SelectItem>
                                <SelectItem value="No Website">No Website</SelectItem>
                                <SelectItem value="Low Rating">Low Rating</SelectItem>
                                <SelectItem value="Broken Link">Broken Link</SelectItem>
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

                        <Button variant="outline" onClick={() => fetchLeads()}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredLeads.length === 0 ? (
                            <Card className="bg-muted/50 border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <p className="text-muted-foreground mb-4">No leads found matching your filters.</p>
                                    <Button variant="link" onClick={() => { setSearchTerm(""); setStatusFilter("All"); setIssueFilter("All"); }}>
                                        Clear Filters
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredLeads.map((lead) => (
                                <Card key={lead.id} className={`flex flex-col md:flex-row items-start md:items-center p-4 gap-4 hover:shadow-md transition-shadow ${lead.status === 'Closed' ? 'border-emerald-500 bg-emerald-50/30' : ''}`}>
                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-lg break-words w-full md:w-auto">{lead.name}</h3>

                                            {/* Specialty Badge */}
                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                {lead.specialty}
                                            </Badge>

                                            {/* Status Dropdown */}
                                            <Select
                                                value={lead.status}
                                                onValueChange={(val: any) => updateLeadStatus(lead.id, val)}
                                            >
                                                <SelectTrigger className={`h-6 text-xs w-auto border-0 px-2 ${STATUS_COLORS[lead.status] || "bg-gray-100"}`}>
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
                                                    variant={lead.email_sent ? "default" : "outline"}
                                                    className={`cursor-pointer select-none ${lead.email_sent ? "bg-blue-500 hover:bg-blue-600 border-blue-500" : "text-muted-foreground hover:bg-muted"}`}
                                                    onClick={() => toggleInteraction(lead.id, 'email_sent')}
                                                >
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    Email
                                                </Badge>
                                                <Badge
                                                    variant={lead.whatsapp_sent ? "default" : "outline"}
                                                    className={`cursor-pointer select-none ${lead.whatsapp_sent ? "bg-green-500 hover:bg-green-600 border-green-500" : "text-muted-foreground hover:bg-muted"}`}
                                                    onClick={() => toggleInteraction(lead.id, 'whatsapp_sent')}
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
                                                {lead.note && !lead.note.toLowerCase().includes('no website') && (
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

                                        <Link to={`/tools/demo-generator?name=${encodeURIComponent(lead.name)}&specialty=${lead.name.toLowerCase().includes('skin') ? 'dermatologist' : 'dentist'}&city=${encodeURIComponent(lead.city || "Mumbai")}&phone=${encodeURIComponent(lead.phone)}&location=${encodeURIComponent(lead.address)}`} className="w-full sm:w-auto">
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
                                                        if (activeLead) {
                                                            toggleInteraction(activeLead.id, 'email_sent');
                                                        }
                                                    }}>
                                                        <Copy className="w-4 h-4 mr-2" />
                                                        Copy & Mark Contacted
                                                    </Button>
                                                    <Button variant="secondary" onClick={() => {
                                                        window.open(`mailto:?subject=${encodeURIComponent(EMAIL_TEMPLATES[selectedTemplate].subject)}&body=${encodeURIComponent(emailDraft)}`);
                                                        if (activeLead) {
                                                            toggleInteraction(activeLead.id, 'email_sent');
                                                        }
                                                    }}>
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        Open Mail Client
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the lead
                                                        <strong> {lead.name} </strong>
                                                        from your database.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteLead(lead.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default LeadManager;
