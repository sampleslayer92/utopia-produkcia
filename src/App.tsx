
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminDashboard from "./pages/AdminDashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import ContractEditPage from "./pages/ContractEditPage";
import ContractDetail from "./components/admin/ContractDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Import i18n configuration
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/contract/:id/edit" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ContractEditPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/contract/:id/view" 
            element={
              <ProtectedRoute requiredRole="admin">
                <ContractDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/partner" 
            element={
              <ProtectedRoute requiredRole="partner">
                <PartnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/merchant" 
            element={
              <ProtectedRoute requiredRole="merchant">
                <MerchantDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
