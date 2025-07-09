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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-24 p-4 bg-glass-button-default border border-glass-button-border backdrop-blur-md rounded-xl hover:bg-glass-hover-bg hover:shadow-[var(--glass-hover-shadow)] hover:scale-[1.02] transition-all duration-300 ease-out group relative overflow-hidden"
              onClick={action.onClick}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${action.gradient}`} />
              <div className="relative flex flex-col items-center justify-center space-y-2 text-center z-10">
                <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-300">
                  <action.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <div className="font-medium text-xs text-foreground leading-tight">
                    {action.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 opacity-90">
                    {action.description}
                  </div>
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