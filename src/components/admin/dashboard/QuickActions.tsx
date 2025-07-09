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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {actions.map((action, index) => (
        <Card
          key={index}
          className="glass-card hover-scale cursor-pointer group overflow-hidden"
          onClick={action.onClick}
        >
          <div className="absolute inset-0 gradient-primary opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <CardContent className="p-8 relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-6 rounded-full gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                <action.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{action.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;