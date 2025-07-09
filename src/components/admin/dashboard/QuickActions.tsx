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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {actions.map((action, index) => (
        <Card
          key={index}
          className="glass-card-dark hover-scale cursor-pointer group overflow-hidden border-0"
          onClick={action.onClick}
        >
          <CardContent className="p-4 relative">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl gradient-accent shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{action.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{action.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;