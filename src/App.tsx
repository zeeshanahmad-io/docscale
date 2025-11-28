import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";

// Lazy load other pages
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Keystatic = lazy(() => import("./pages/Keystatic"));
const IndustryPage = lazy(() => import("./pages/IndustryPage"));
const SeoAuditor = lazy(() => import("./pages/tools/SeoAuditor"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const DemoGenerator = lazy(() => import("./pages/tools/DemoGenerator"));
const Dashboard = lazy(() => import("./pages/tools/Dashboard"));
const LeadManager = lazy(() => import("./pages/tools/LeadManager"));

import ProtectedRoute from "./components/ProtectedRoute";

import programmaticData from "@/data/programmaticData.json";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + L (Mac: Cmd + Shift + L)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'l') {
        window.location.href = '/tools';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/tools/seo-auditor" element={<SeoAuditor />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/keystatic/*" element={<Keystatic />} />
              <Route path="/tools" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/tools/demo-generator" element={
                <ProtectedRoute>
                  <DemoGenerator />
                </ProtectedRoute>
              } />
              <Route path="/tools/lead-manager" element={
                <ProtectedRoute>
                  <LeadManager />
                </ProtectedRoute>
              } />
              <Route path="/demo/preview" element={<DemoPage />} />

              {/* Programmatic SEO Routes */}
              {programmaticData.specialties.flatMap(specialty =>
                programmaticData.cities.map(city => (
                  <Route
                    key={`${specialty.id}-${city.id}`}
                    path={`/marketing-for-${specialty.id}-in-${city.id}`}
                    element={<IndustryPage specialtyId={specialty.id} cityId={city.id} />}
                  />
                ))
              )}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
