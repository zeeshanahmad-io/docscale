import { useSearchParams } from "react-router-dom";
import demoData from "@/data/demoData.json";
import StandardTemplate from "@/components/demo/StandardTemplate";
import LuxuryTemplate from "@/components/demo/LuxuryTemplate";

const DemoPage = () => {
    const [searchParams] = useSearchParams();

    // URL Params with Defaults
    const name = searchParams.get("name") || "Dr. Faiyaz Ahmad";
    const specialty = searchParams.get("specialty")?.toLowerCase() || "neurologist";
    const city = searchParams.get("city") || "Patna";
    const phone = searchParams.get("phone") || "+91 98765 43210";
    const location = searchParams.get("location") || `Raja Bazar, ${city}`;
    const style = searchParams.get("style") || "standard";

    // Get data based on specialty or fall back to default
    // @ts-ignore
    const data = demoData[specialty] || demoData["default"];
    const theme = data.theme || demoData["default"].theme;

    // Capitalize helper
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const specialtyLabel = capitalize(specialty.replace('-', ' '));

    const commonProps = {
        data,
        theme,
        name,
        specialtyLabel,
        city,
        phone,
        location
    };

    if (style === "luxury") {
        return <LuxuryTemplate {...commonProps} />;
    }

    return <StandardTemplate {...commonProps} />;
};

export default DemoPage;
