import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, MapPin, Phone, Star, RefreshCw } from "lucide-react";
import leadsData from "@/data/leads.json";
import { Link } from "react-router-dom";

// Define Lead type based on scraper output
interface Lead {
    name: string;
    rating: number;
    address: string;
    website: string | null;
    phone: string;
    status: string;
}

const LeadManager = () => {
    // Cast the imported JSON to the Lead array type
    const [leads, setLeads] = useState<Lead[]>(leadsData as Lead[]);

    const generateDemoLink = (lead: Lead) => {
        const params = new URLSearchParams();
        params.append("name", lead.name);
        // Guess specialty based on name or default to 'dentist'
        const specialty = lead.name.toLowerCase().includes('skin') ? 'dermatologist' :
            lead.name.toLowerCase().includes('heart') ? 'cardiologist' : 'dentist';
        params.append("specialty", specialty);

        // Extract city from address (simple heuristic)
        const city = lead.address.split(',').pop()?.trim() || "Mumbai";
        params.append("city", city);

        params.append("phone", lead.phone);
        params.append("location", lead.address);

        return `/tools/demo-generator?${params.toString()}`; // Link to the internal generator tool
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Manager (Sniper)</h1>
                        <p className="text-muted-foreground">
                            {leads.length} qualified leads found (No Website or Low Rating).
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                    </Button>
                </div>

                <div className="grid gap-4">
                    {leads.length === 0 ? (
                        <Card className="bg-muted/50 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-muted-foreground mb-4">No leads found yet.</p>
                                <p className="text-sm text-muted-foreground">
                                    Run the scraper script: <code className="bg-background px-2 py-1 rounded">node scripts/scrape-leads.js "Dentist in Bandra"</code>
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        leads.map((lead, index) => (
                            <Card key={index} className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4 hover:shadow-md transition-shadow">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg truncate">{lead.name}</h3>
                                        <Badge variant={lead.rating < 3.5 ? "destructive" : "secondary"}>
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            {lead.rating || "N/A"}
                                        </Badge>
                                        {!lead.website && (
                                            <Badge variant="outline" className="border-yellow-500 text-yellow-600 bg-yellow-50">
                                                No Website
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {lead.address}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {lead.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Link to={generateDemoLink(lead)}>
                                        <Button size="sm" className="w-full md:w-auto bg-primary text-primary-foreground">
                                            Generate Demo
                                        </Button>
                                    </Link>
                                    <Button size="sm" variant="outline" className="w-full md:w-auto">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Draft Email
                                    </Button>
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
