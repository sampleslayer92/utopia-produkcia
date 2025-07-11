import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import UtopiaLogo from "@/assets/utopia-logo.svg";

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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col safe-area-inset-top safe-area-inset-bottom">
      {/* Header with Language Switcher */}
      <div className="flex justify-end p-4 md:p-6 safe-area-inset-left safe-area-inset-right">
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 md:px-6 pb-8 md:pb-12">
        <div className="flex flex-col items-center space-y-8 md:space-y-12">
          {/* Utopia Logo */}
          <div className="text-center">
            <img 
              src={UtopiaLogo} 
              alt="Utopia" 
              className="h-20 md:h-28 w-auto mx-auto mb-4 opacity-90" 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md">
            <Button
              onClick={handleLogin}
              variant="default"
              size="lg"
              className="flex items-center justify-center gap-3 h-12 md:h-14 px-6 md:px-8 font-medium text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <LogIn className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
              {t('welcome.login.title')}
            </Button>

            <Button
              onClick={handleNewClient}
              variant="outline"
              size="lg"
              className="flex items-center justify-center gap-3 h-12 md:h-14 px-6 md:px-8 font-medium text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary hover:text-primary-foreground group border-primary/20 hover:border-primary"
            >
              <UserPlus className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300" />
              {t('welcome.onboarding.title')}
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default Welcome;