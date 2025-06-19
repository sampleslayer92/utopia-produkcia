
import { useTranslation } from 'react-i18next';
import AdminSidebar from "@/components/admin/AdminSidebar";
import EnhancedAdminTable from "@/components/admin/EnhancedAdminTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Activity, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const ContractsPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{t('contracts.title')}</h1>
                <p className="text-sm text-slate-600">{t('contracts.subtitle')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <LanguageSwitcher />
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  {t('dashboard.status.online')}
                </Badge>
                <Button variant="outline" className="hover:bg-slate-50">
                  <Download className="h-4 w-4 mr-2" />
                  {t('contracts.export')}
                </Button>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('contracts.newContract')}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          <EnhancedAdminTable />
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;
