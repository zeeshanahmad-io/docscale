import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PatientRevenueCalculator = () => {
    const [avgValue, setAvgValue] = useState([500]);
    const [dailyVisitors, setDailyVisitors] = useState([50]);
    const [lostRevenue, setLostRevenue] = useState(0);

    useEffect(() => {
        // Formula: Visitors * 30 days * 20% (lost leads) * Avg Value
        const monthlyVisitors = dailyVisitors[0] * 30;
        const lostLeads = Math.round(monthlyVisitors * 0.2); // Assuming 20% drop-off due to poor UX/no booking
        const revenue = lostLeads * avgValue[0];
        setLostRevenue(revenue);
    }, [avgValue, dailyVisitors]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-strong border-primary/20">
            <CardHeader className="bg-muted/30">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calculator className="w-6 h-6 text-primary" />
                    Patient Revenue Calculator
                </CardTitle>
                <CardDescription>
                    See how much revenue you might be losing without an optimized website and online booking.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="space-y-6">
                    {/* Avg Patient Value Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="avg-value-slider" className="text-sm font-medium text-muted-foreground">
                                Average Patient Visit Value
                            </label>
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(avgValue[0])}
                            </span>
                        </div>
                        <Slider
                            id="avg-value-slider"
                            value={avgValue}
                            onValueChange={setAvgValue}
                            min={100}
                            max={5000}
                            step={100}
                            className="py-4"
                            aria-label="Average Patient Visit Value"
                        />
                        <p className="text-xs text-muted-foreground">
                            How much does an average consultation or treatment cost?
                        </p>
                    </div>

                    {/* Daily Visitors Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="daily-visitors-slider" className="text-sm font-medium text-muted-foreground">
                                Daily Website Visitors
                            </label>
                            <span className="text-xl font-bold text-primary">
                                {dailyVisitors[0]}
                            </span>
                        </div>
                        <Slider
                            id="daily-visitors-slider"
                            value={dailyVisitors}
                            onValueChange={setDailyVisitors}
                            min={10}
                            max={1000}
                            step={10}
                            className="py-4"
                            aria-label="Daily Website Visitors"
                        />
                        <p className="text-xs text-muted-foreground">
                            Estimated number of people visiting your site daily.
                        </p>
                    </div>
                </div>

                {/* Result Section */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 text-center space-y-2 animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center mb-2">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground">
                        Potential Monthly Revenue Loss
                    </h3>
                    <div className="text-4xl md:text-5xl font-bold text-destructive">
                        {formatCurrency(lostRevenue)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        By not converting just 20% of your visitors into appointments.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="w-full md:w-auto text-lg px-8 shadow-lg hover:shadow-xl transition-all"
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Stop Losing Revenue - Get Started
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
