
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, userRole } = useAuth();
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
          navigate('/admin'); // Same interface as admin
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Language Switcher */}
        <div className="flex justify-end mb-8">
          <LanguageSwitcher />
        </div>

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
