import { ShieldCheck, Zap, Lock } from "lucide-react";

export const TrustBadges = () => {
    return (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 text-sm font-medium text-blue-50 animate-fade-in">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-white/10 rounded-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span>DISHA/HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1 bg-white/10 rounded-full">
                    <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1 bg-white/10 rounded-full">
                    <Lock className="w-4 h-4 text-blue-400" />
                </div>
                <span>SSL Secured</span>
            </div>
        </div>
    );
};
