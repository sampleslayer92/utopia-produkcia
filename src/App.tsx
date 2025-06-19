
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminDashboard from "./pages/AdminDashboard";
import ContractsPage from "./pages/ContractsPage";
import MerchantsPage from "./pages/MerchantsPage";
import PartnerDashboard from "./pages/PartnerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import ContractEditPage from "./pages/ContractEditPage";
import ContractDetail from "./components/admin/ContractDetail";
import MerchantDetailPage from "./pages/MerchantDetailPage";
import NotFound from "./pages/NotFound";

// Import i18n configuration
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/contracts" element={<ContractsPage />} />
        <Route path="/admin/merchants" element={<MerchantsPage />} />
        <Route path="/admin/contract/:id/edit" element={<ContractEditPage />} />
        <Route path="/admin/contract/:id/view" element={<ContractDetail />} />
        <Route path="/admin/merchant/:id/view" element={<MerchantDetailPage />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
