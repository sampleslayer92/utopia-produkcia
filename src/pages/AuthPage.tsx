
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('auth');
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
      toast.error(t('messages.signInError'), {
        description: error.message
      });
    } else {
      toast.success(t('messages.signInSuccess'));
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
      toast.error(t('messages.signUpError'), {
        description: error.message
      });
    } else {
      toast.success(t('messages.signUpSuccess'), {
        description: t('messages.signUpSuccessDesc')
      });
    }

    setIsLoading(false);
  };

  const handleForceLogout = async () => {
    try {
      await signOut();
      toast.success(t('messages.logoutSuccess'));
    } catch (error) {
      toast.error(t('messages.logoutError'));
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
                    {t('actions.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-16 w-auto mx-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-slate-600">
            {t('subtitle')}
          </p>
        </div>

        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('header.authentication')}</CardTitle>
            <CardDescription>
              {t('header.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t('tabs.signin')}</TabsTrigger>
                <TabsTrigger value="signup">{t('tabs.signup')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('form.email')}</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('form.password')}</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder={t('form.passwordPlaceholder')}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('actions.signingIn') : t('actions.signIn')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstName">{t('form.firstName')}</Label>
                      <Input
                        id="signup-firstName"
                        name="firstName"
                        type="text"
                        placeholder={t('form.firstNamePlaceholder')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastName">{t('form.lastName')}</Label>
                      <Input
                        id="signup-lastName"
                        name="lastName"
                        type="text"
                        placeholder={t('form.lastNamePlaceholder')}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('form.email')}</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('form.password')}</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder={t('form.passwordPlaceholder')}
                      required
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('actions.signingUp') : t('actions.signUp')}
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
            {t('actions.backToWelcome')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
