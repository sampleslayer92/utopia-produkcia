
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header with Language Switcher */}
      <div className="flex justify-end p-6">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md">
          
          {/* Current User Status */}
          {user && profile && userRole && (
            <Card className="mb-8 border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {profile.first_name} {profile.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      {userRole.role.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleForceLogout}
                      className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      {t('actions.logout')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="mb-8">
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
                alt="Utopia Logo" 
                className="h-20 w-auto mx-auto mb-6" 
              />
            </div>
            
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold text-foreground">{t('header.authentication')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('header.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {t('tabs.signin')}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {t('tabs.signup')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-6 mt-0">
                  <form onSubmit={handleSignIn} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                        {t('form.email')}
                      </Label>
                      <Input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder={t('form.emailPlaceholder')}
                        required
                        className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                        {t('form.password')}
                      </Label>
                      <Input
                        id="signin-password"
                        name="password"
                        type="password"
                        placeholder={t('form.passwordPlaceholder')}
                        required
                        className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive" className="animate-fade-in bg-destructive/5 border-destructive/20">
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? t('actions.signingIn') : t('actions.signIn')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-6 mt-0">
                  <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstName" className="text-sm font-medium text-foreground">
                          {t('form.firstName')}
                        </Label>
                        <Input
                          id="signup-firstName"
                          name="firstName"
                          type="text"
                          placeholder={t('form.firstNamePlaceholder')}
                          required
                          className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastName" className="text-sm font-medium text-foreground">
                          {t('form.lastName')}
                        </Label>
                        <Input
                          id="signup-lastName"
                          name="lastName"
                          type="text"
                          placeholder={t('form.lastNamePlaceholder')}
                          required
                          className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                        {t('form.email')}
                      </Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder={t('form.emailPlaceholder')}
                        required
                        className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                        {t('form.password')}
                      </Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        placeholder={t('form.passwordPlaceholder')}
                        required
                        className="h-12 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                      />
                    </div>
                    {error && (
                      <Alert variant="destructive" className="animate-fade-in bg-destructive/5 border-destructive/20">
                        <AlertDescription className="text-destructive">{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary hover:shadow-lg transition-all duration-300" 
                      disabled={isLoading}
                    >
                      {isLoading ? t('actions.signingUp') : t('actions.signUp')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Back to Welcome */}
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300"
            >
              {t('actions.backToWelcome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
