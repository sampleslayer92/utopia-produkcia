import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Zap, Shield, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Clean up any existing localStorage role data on component mount
  useEffect(() => {
    localStorage.removeItem('utopia_user_role');
  }, []);

  const handleNewClient = () => {
    navigate('/onboarding');
  };

  const handleLogin = () => {
    navigate('/auth');
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header with Language Switcher */}
      <div className="flex justify-end p-6">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <img src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" alt="Utopia Logo" className="h-24 w-auto mx-auto mb-8 animate-fade-in" />
            </div>
            
            <div className="space-y-6 mb-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent leading-tight animate-fade-in">
                {t('welcome.title')}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-muted-foreground animate-fade-in">
                {t('welcome.subtitle')}
              </p>
              
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t('welcome.features.fast.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('welcome.features.fast.description')}</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t('welcome.features.secure.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('welcome.features.secure.description')}</p>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t('welcome.features.simple.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('welcome.features.simple.description')}</p>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="max-w-2xl mx-auto space-y-4">
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-primary/30 group" onClick={handleLogin}>
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <LogIn className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{t('welcome.login.title')}</h2>
                    <p className="text-muted-foreground text-lg">{t('welcome.login.description')}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-emerald-500/30 group" onClick={handleNewClient}>
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" alt="Utopia Logo" className="h-8 w-8 object-contain brightness-0 invert" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{t('welcome.onboarding.title')}</h2>
                    <p className="text-muted-foreground text-lg">{t('welcome.onboarding.description')}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t('welcome.footer')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Welcome;