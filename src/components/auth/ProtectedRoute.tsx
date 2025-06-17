
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'partner' | 'merchant';
  redirectTo?: string;
}

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/' }: ProtectedRouteProps) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Načítavam...</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-600">
              Overujem prihlásenie...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Nedostatočné oprávnenia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Na túto stránku nemáte dostatočné oprávnenia.
            </p>
            <p className="text-sm text-slate-500">
              Požadovaná rola: {requiredRole}
              <br />
              Vaša rola: {userRole || 'Žiadna'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
