
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'merchant';
  allowedRoles?: ('admin' | 'partner' | 'merchant')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  allowedRoles 
}) => {
  const { user, userRole, isLoading } = useAuth();

  console.log('🔍 [ProtectedRoute Debug] Current user:', user?.email);
  console.log('🔍 [ProtectedRoute Debug] Current role:', userRole?.role);
  console.log('🔍 [ProtectedRoute Debug] Required role:', requiredRole);
  console.log('🔍 [ProtectedRoute Debug] Allowed roles:', allowedRoles);
  console.log('🔍 [ProtectedRoute Debug] Is loading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Načítava sa...</p>
        </div>
      </div>
    );
  }

  if (!user || !userRole) {
    console.log('🔍 [ProtectedRoute Debug] No user or role, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Check role permissions
  if (requiredRole && userRole.role !== requiredRole) {
    console.log('🔍 [ProtectedRoute Debug] Role mismatch, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole.role)) {
    console.log('🔍 [ProtectedRoute Debug] Role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('🔍 [ProtectedRoute Debug] Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
