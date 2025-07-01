
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Welcome from "./pages/Welcome";
import AuthPage from "./pages/AuthPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminDashboard from "./pages/AdminDashboard";
import ContractsPage from "./pages/ContractsPage";
import MerchantsPage from "./pages/MerchantsPage";
import TeamPage from "./pages/TeamPage";
import TeamMemberDetailPage from "./pages/TeamMemberDetailPage";
import PartnerDashboard from "./pages/PartnerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import ContractEditPage from "./pages/ContractEditPage";
import ContractDetail from "./components/admin/ContractDetail";
import MerchantDetailPage from "./pages/MerchantDetailPage";
import AdminOnboardingPage from "./pages/AdminOnboardingPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import DealsPage from "./pages/DealsPage";
import NotFound from "./pages/NotFound";

// Import i18n configuration
import './i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          
          {/* Admin routes - accessible by admin and partner */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/contracts" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <ContractsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/deals" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <DealsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/merchants" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <MerchantsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/team" element={
            <ProtectedRoute requiredRole="admin">
              <TeamPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/team/:memberId" element={
            <ProtectedRoute requiredRole="admin">
              <TeamMemberDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/onboarding" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <AdminOnboardingPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/contract/:id/edit" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <ContractEditPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/contract/:id/view" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <ContractDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/merchant/:id/view" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <MerchantDetailPage />
            </ProtectedRoute>
          } />
          
          {/* Partner routes - same as admin but with different access */}
          <Route path="/partner" element={
            <ProtectedRoute requiredRole="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Merchant routes */}
          <Route path="/merchant" element={
            <ProtectedRoute requiredRole="merchant">
              <MerchantDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
