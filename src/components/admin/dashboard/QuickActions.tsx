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
    <Card className="bg-card border-border shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground font-semibold tracking-tight">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-28 p-6 bg-card border-border hover:shadow-elevation-2 hover:bg-muted/50 transition-all duration-300 ease-out group relative overflow-hidden"
              onClick={action.onClick}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start text-left flex-1 min-w-0 mr-4">
                  <div className="font-bold text-base text-foreground leading-tight truncate w-full mb-1">
                    {action.title}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {action.description}
                  </div>
                </div>
                <div className="flex-shrink-0 p-3.5 rounded-full bg-primary shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                  <action.icon className="h-7 w-7 text-primary-foreground" />
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