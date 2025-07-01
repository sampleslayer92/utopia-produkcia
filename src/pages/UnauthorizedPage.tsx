
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { signOut, userRole } = useAuth();

  const handleGoBack = () => {
    if (userRole) {
      switch (userRole.role) {
        case 'admin':
        case 'partner':
          navigate('/admin');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Nemáte oprávnenie</CardTitle>
            <CardDescription className="text-red-700">
              Nemáte dostatočné oprávnenia na prístup k tejto stránke.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleGoBack} className="w-full">
              Späť na hlavnú stránku
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Odhlásiť sa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
