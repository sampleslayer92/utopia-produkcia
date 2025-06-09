
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, User, ArrowRight, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleRoleSelect = (role: 'admin' | 'partner' | 'merchant') => {
    localStorage.setItem('utopia_user_role', role);
    
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'partner':
        navigate('/partner');
        break;
      case 'merchant':
        navigate('/merchant');
        break;
    }
  };

  const handleNewClient = () => {
    navigate('/onboarding');
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-between items-start mb-4">
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
                alt="Utopia Logo" 
                className="h-16 w-auto mx-auto"
              />
              <LanguageSwitcher />
            </div>
            <p className="text-slate-600 mt-2">{t('welcome.selectRole')}</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('admin')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('roles.admin')}</h3>
                    <p className="text-sm text-slate-600">{t('roles.adminDescription')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('partner')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('roles.partner')}</h3>
                    <p className="text-sm text-slate-600">{t('roles.partnerDescription')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('merchant')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('roles.merchant')}</h3>
                    <p className="text-sm text-slate-600">{t('roles.merchantDescription')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowRoleSelection(false)}
              className="text-slate-600 border-slate-300"
            >
              {t('welcome.back')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1 flex justify-center">
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
                alt="Utopia Logo" 
                className="h-20 w-auto animate-fade-in"
              />
            </div>
            <div className="absolute top-6 right-6">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight animate-fade-in">
              {t('welcome.title')}
            </h1>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent animate-fade-in">
              {t('welcome.subtitle')}
            </p>
          </div>
        </div>

        {/* Main Options */}
        <div className="space-y-4">
          <Card 
            className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300 group"
            onClick={() => setShowRoleSelection(true)}
          >
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    {t('welcome.login')}
                  </h2>
                  <p className="text-slate-600">
                    {t('welcome.loginDescription')}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-emerald-300 group"
            onClick={handleNewClient}
          >
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
                    alt="Utopia Logo" 
                    className="h-7 w-7 object-contain brightness-0 invert"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    {t('welcome.startOnboarding')}
                  </h2>
                  <p className="text-slate-600">
                    {t('welcome.onboardingDescription')}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('welcome.footer')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
