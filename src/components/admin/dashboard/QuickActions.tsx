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
      variant: "primary" as const,
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: t('dashboard.quickActions.contracts'),
      description: t('dashboard.quickActions.contractsDesc'),
      icon: FileText,
      variant: "accent" as const,
      onClick: () => navigate('/admin/merchants/contracts')
    },
    {
      title: t('dashboard.quickActions.merchants'),
      description: t('dashboard.quickActions.merchantsDesc'),
      icon: Building2,
      variant: "teal" as const,
      onClick: () => navigate('/admin/merchants')
    },
    {
      title: t('dashboard.quickActions.locations'),
      description: t('dashboard.quickActions.locationsDesc'),
      icon: BarChart3,
      variant: "coral" as const,
      onClick: () => navigate('/admin/merchants/locations')
    },
    {
      title: t('dashboard.quickActions.team'),
      description: t('dashboard.quickActions.teamDesc'),
      icon: Users,
      variant: "dark" as const,
      onClick: () => navigate('/admin/team/performance')
    }
  ];

  const getActionClasses = (variant: "primary" | "accent" | "teal" | "coral" | "dark") => {
    switch (variant) {
      case "primary":
        return {
          bg: "bg-primary hover:bg-primary-dark",
          text: "text-primary-foreground",
          iconBg: "bg-primary-foreground/20",
          iconText: "text-primary-foreground"
        };
      case "accent":
        return {
          bg: "bg-accent hover:bg-accent/90",
          text: "text-accent-foreground",
          iconBg: "bg-accent-foreground/20",
          iconText: "text-accent-foreground"
        };
      case "teal":
        return {
          bg: "bg-accent-teal hover:bg-accent-teal/90",
          text: "text-white",
          iconBg: "bg-white/20",
          iconText: "text-white"
        };
      case "coral":
        return {
          bg: "bg-accent-coral hover:bg-accent-coral/90",
          text: "text-white",
          iconBg: "bg-white/20",
          iconText: "text-white"
        };
      case "dark":
        return {
          bg: "bg-card-dark hover:bg-card-dark/80",
          text: "text-card-dark-foreground",
          iconBg: "bg-card-dark-foreground/20",
          iconText: "text-card-dark-foreground"
        };
      default:
        return {
          bg: "bg-card hover:bg-muted/50",
          text: "text-foreground",
          iconBg: "bg-primary/20",
          iconText: "text-primary"
        };
    }
  };

  return (
    <Card className="bg-card border-border shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground tracking-tight">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {actions.map((action, index) => {
            const actionClasses = getActionClasses(action.variant);
            
            return (
              <Button
                key={index}
                variant="outline"
                className={`h-32 p-6 border-0 ${actionClasses.bg} shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 ease-out group relative overflow-hidden transform hover:scale-[1.02]`}
                onClick={action.onClick}
              >
                <div className="flex flex-col items-center text-center space-y-3 w-full">
                  <div className={`p-4 rounded-2xl ${actionClasses.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`h-8 w-8 ${actionClasses.iconText}`} />
                  </div>
                  <div className="space-y-1">
                    <div className={`font-bold text-base ${actionClasses.text} leading-tight`}>
                      {action.title}
                    </div>
                    <div className={`text-xs ${actionClasses.text}/80 leading-relaxed line-clamp-2`}>
                      {action.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;