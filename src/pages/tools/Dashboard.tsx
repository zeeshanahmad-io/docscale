import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Search, Users, Terminal, LogOut, ArrowRight } from "lucide-react";

const Dashboard = () => {
    const navigate = useNavigate();

    const tools = [
        {
            name: "Lead Manager (Sniper)",
            description: "Manage leads, track outreach, and send personalized messages.",
            icon: <Users className="w-8 h-8 text-blue-500" />,
            path: "/tools/lead-manager",
            color: "bg-blue-50 border-blue-200"
        },
        {
            name: "Demo Generator",
            description: "Create instant, personalized website previews for leads.",
            icon: <Terminal className="w-8 h-8 text-purple-500" />,
            path: "/tools/demo-generator",
            color: "bg-purple-50 border-purple-200"
        },
        {
            name: "SEO Auditor",
            description: "Run detailed SEO audits and generate PDF reports.",
            icon: <Search className="w-8 h-8 text-green-500" />,
            path: "/tools/seo-auditor",
            color: "bg-green-50 border-green-200"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/");
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <Shield className="w-8 h-8 text-primary" />
                            Internal Tools
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Restricted access area for DocScale admins.
                        </p>
                    </div>
                    <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.path} to={tool.path}>
                            <Card className={`h-full transition-all hover:shadow-lg hover:-translate-y-1 ${tool.color}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                            {tool.icon}
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <CardTitle className="mt-4 text-xl">{tool.name}</CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {tool.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
