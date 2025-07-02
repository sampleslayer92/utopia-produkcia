
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Welcome from "./pages/Welcome";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminDashboard from "./pages/AdminDashboard";
import ContractsPage from "./pages/ContractsPage";
import MerchantsPage from "./pages/MerchantsPage";
import TeamManagement from "./components/admin/TeamManagement";
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
import BusinessLocationsPage from "./pages/BusinessLocationsPage";
import BusinessLocationDetailPage from "./pages/BusinessLocationDetailPage";
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
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          
          {/* Admin routes - accessible only by admin */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Shared routes for admin and partner */}
          <Route path="/admin/merchants/contracts" element={
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
          <Route path="/admin/merchants/locations" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <BusinessLocationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/merchants/location/:id/view" element={
            <ProtectedRoute allowedRoles={['admin', 'partner']}>
              <BusinessLocationDetailPage />
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
          
          {/* Admin-only routes */}
          <Route path="/admin/team" element={
            <ProtectedRoute requiredRole="admin">
              <TeamManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/team/performance" element={
            <ProtectedRoute requiredRole="admin">
              <TeamPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/team/:memberId" element={
            <ProtectedRoute requiredRole="admin">
              <TeamMemberDetailPage />
            </ProtectedRoute>
          } />
          
          {/* Partner routes - use dedicated PartnerDashboard */}
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
