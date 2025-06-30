
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRoleSelect = (role: 'admin' | 'partner' | 'merchant') => {
    localStorage.setItem('utopia_user_role', role);
    navigate(`/auth?role=${role}`);
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <img 
          src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
          alt="Utopia Logo" 
          className="h-8 w-auto" 
        />
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="text-slate-600 border-slate-300"
          >
            {t('welcome.backButton')}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-full max-w-lg">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              {t('welcome.selectRole')}
            </h1>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4">
            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-emerald-300 group" 
              onClick={() => handleRoleSelect('admin')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('welcome.roles.admin.title')}</h3>
                    <p className="text-sm text-slate-600">{t('welcome.roles.admin.description')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300 group" 
              onClick={() => handleRoleSelect('partner')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('welcome.roles.partner.title')}</h3>
                    <p className="text-sm text-slate-600">{t('welcome.roles.partner.description')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-purple-300 group" 
              onClick={() => handleRoleSelect('merchant')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{t('welcome.roles.merchant.title')}</h3>
                    <p className="text-sm text-slate-600">{t('welcome.roles.merchant.description')}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
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
    </div>
  );
};

export default Welcome;
