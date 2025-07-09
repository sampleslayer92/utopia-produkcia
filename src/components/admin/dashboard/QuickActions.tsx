import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Building2, Users, BarChart3, Settings } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  const actions = [
    {
      title: t('dashboard.quickActions.newContract'),
      description: t('dashboard.quickActions.newContractDesc'),
      icon: Plus,
      gradient: "bg-action-blue",
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: t('dashboard.quickActions.contracts'),
      description: t('dashboard.quickActions.contractsDesc'),
      icon: FileText,
      gradient: "bg-action-emerald",
      onClick: () => navigate('/admin/merchants/contracts')
    },
    {
      title: t('dashboard.quickActions.merchants'),
      description: t('dashboard.quickActions.merchantsDesc'),
      icon: Building2,
      gradient: "bg-action-purple",
      onClick: () => navigate('/admin/merchants')
    },
    {
      title: t('dashboard.quickActions.locations'),
      description: t('dashboard.quickActions.locationsDesc'),
      icon: BarChart3,
      gradient: "bg-action-orange",
      onClick: () => navigate('/admin/merchants/locations')
    },
    {
      title: t('dashboard.quickActions.team'),
      description: t('dashboard.quickActions.teamDesc'),
      icon: Users,
      gradient: "bg-action-cyan",
      onClick: () => navigate('/admin/team/performance')
    }
  ];

  return (
    <Card className="border-glass-border bg-glass-bg backdrop-blur-lg shadow-[var(--glass-shadow)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="text-foreground font-semibold tracking-tight">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-20 p-4 bg-white border border-gray-200/60 rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-out group relative overflow-hidden"
              onClick={action.onClick}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start text-left flex-1 min-w-0 mr-3">
                  <div className="font-semibold text-sm text-gray-900 leading-tight truncate w-full">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {action.description}
                  </div>
                </div>
                <div className={`flex-shrink-0 p-2.5 rounded-full bg-gradient-to-br ${action.gradient} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;