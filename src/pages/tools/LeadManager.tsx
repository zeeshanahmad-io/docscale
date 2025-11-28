import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label"; // Added Label import
import { ExternalLink, Mail, MapPin, Phone, Star, RefreshCw, Search, Copy, Check } from "lucide-react";
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
    status: string;
    note?: string;
}

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
    // Cast the imported JSON to the Lead array type
    const [leads, setLeads] = useState<Lead[]>(leadsData as Lead[]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof EMAIL_TEMPLATES>("broken_link");
    const [emailDraft, setEmailDraft] = useState("");
    const [activeLead, setActiveLead] = useState<Lead | null>(null);

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateDemoLink = (lead: Lead) => {
        const params = new URLSearchParams();
        params.append("name", lead.name);
        const specialty = lead.name.toLowerCase().includes('skin') ? 'dermatologist' :
            lead.name.toLowerCase().includes('heart') ? 'cardiologist' : 'dentist';
        params.append("specialty", specialty);
        const city = lead.address.split(',').pop()?.trim() || "Mumbai";
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
                        <Link to="/">
                            <Button variant="ghost">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Manager (Sniper)</h1>
                        <p className="text-muted-foreground">
                            {leads.length} qualified leads found.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter leads..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredLeads.length === 0 ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-muted-foreground mb-4">No leads found.</p>
                                <p className="text-sm text-muted-foreground">
                                    Run the scraper: <code className="bg-background px-2 py-1 rounded">node scripts/scrape-leads.js "Dentist in Bandra"</code>
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredLeads.map((lead, index) => (
                            <Card key={index} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4 hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg break-words w-full md:w-auto">{lead.name}</h3>
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
                                                <Button onClick={() => copyToClipboard(emailDraft)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy Body
                                                </Button>
                                                <Button variant="secondary" onClick={() => window.open(`mailto:?subject=${encodeURIComponent(EMAIL_TEMPLATES[selectedTemplate].subject)}&body=${encodeURIComponent(emailDraft)}`)}>
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
