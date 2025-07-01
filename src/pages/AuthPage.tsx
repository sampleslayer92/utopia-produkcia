
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { LogOut, User, Shield } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, user, userRole, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && userRole) {
      switch (userRole.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'partner':
          navigate('/partner');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, userRole, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      toast.error('Chyba pri prihlásení', {
        description: error.message
      });
    } else {
      toast.success('Úspešne prihlásený!');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const { error } = await signUp(email, password, firstName, lastName);

    if (error) {
      setError(error.message);
      toast.error('Chyba pri registrácii', {
        description: error.message
      });
    } else {
      toast.success('Registrácia úspešná!', {
        description: 'Skontrolujte si email pre potvrdenie účtu.'
      });
    }

    setIsLoading(false);
  };

  const handleForceLogout = async () => {
    try {
      await signOut();
      toast.success('Úspešne odhlásený');
    } catch (error) {
      toast.error('Chyba pri odhlásení');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'partner':
        return 'bg-blue-100 text-blue-700';
      case 'merchant':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

        {/* Current User Status */}
        {user && profile && userRole && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
                    <User className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm text-amber-700">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getRoleBadgeColor(userRole.role)} variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {userRole.role.toUpperCase()}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleForceLogout}
                    className="text-amber-700 border-amber-300 hover:bg-amber-100"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Odhlásiť
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-16 w-auto mx-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Vitajte v Utopia
          </h1>
          <p className="text-slate-600">
            Prihláste sa do svojho účtu
          </p>
        </div>

        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Autentifikácia</CardTitle>
            <CardDescription>
              Prihláste sa alebo si vytvorte nový účet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Prihlásenie</TabsTrigger>
                <TabsTrigger value="signup">Registrácia</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="vas@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Heslo</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="Vaše heslo"
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Prihlasuje sa...' : 'Prihlásiť sa'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstName">Meno</Label>
                      <Input
                        id="signup-firstName"
                        name="firstName"
                        type="text"
                        placeholder="Vaše meno"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastName">Priezvisko</Label>
                      <Input
                        id="signup-lastName"
                        name="lastName"
                        type="text"
                        placeholder="Vaše priezvisko"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="vas@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Heslo</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Vaše heslo"
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registruje sa...' : 'Registrovať sa'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Back to Welcome */}
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-slate-600"
          >
            ← Späť na úvodnú stránku
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
