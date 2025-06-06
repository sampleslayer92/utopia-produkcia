
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { usePasswordProtection } from "@/hooks/usePasswordProtection";
import PasswordScreen from "@/components/PasswordScreen";
import Welcome from "./pages/Welcome";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import ContractEditPage from "./pages/ContractEditPage";
import ContractDetail from "./components/admin/ContractDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedApp = () => {
  const { isAuthenticated, isLoading, authenticate } = usePasswordProtection();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-16 w-auto mx-auto mb-4 animate-pulse"
          />
          <p className="text-slate-600">Načítavam...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticate={authenticate} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/contract/:id/edit" element={<ContractEditPage />} />
        <Route path="/admin/contract/:id/view" element={<ContractDetail />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProtectedApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
