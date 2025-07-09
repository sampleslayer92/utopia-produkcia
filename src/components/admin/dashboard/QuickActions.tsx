import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Plus, FileText, BarChart3, Settings } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  const actions = [
    {
      title: t('dashboard.quickActions.newContract'),
      description: t('dashboard.quickActions.newContractDesc'),
      icon: Plus,
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: t('dashboard.quickActions.viewContracts'),
      description: t('dashboard.quickActions.viewContractsDesc'),
      icon: FileText,
      onClick: () => navigate('/admin/contracts')
    },
    {
      title: t('dashboard.quickActions.reports'),
      description: t('dashboard.quickActions.reportsDesc'),
      icon: BarChart3,
      onClick: () => navigate('/admin/reports')
    },
    {
      title: t('dashboard.quickActions.settings'),
      description: t('dashboard.quickActions.settingsDesc'),
      icon: Settings,
      onClick: () => navigate('/admin/settings')
    }
  ];

  return (
    <div className="bg-header-dark/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6 shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 transition-all duration-200 hover-lift"
          >
            <div className="p-3 rounded-lg gradient-accent shadow-lg group-hover:shadow-glow transition-all duration-200">
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-white/60 leading-tight">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;