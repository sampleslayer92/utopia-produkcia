
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const DashboardHeader = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
            <p className="text-sm text-slate-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              {t('dashboard.status.online')}
            </Badge>
            <Button 
              onClick={() => navigate('/admin/onboarding')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('dashboard.newContract')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
