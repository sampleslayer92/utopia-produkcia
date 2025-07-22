
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Building2, Users, BarChart3 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('admin');
  const isMobile = useIsMobile();

  const actions = [
    {
      title: t('dashboard.quickActions.newContract'),
      description: t('dashboard.quickActions.newContractDesc'),
      icon: Plus,
      gradient: "from-blue-500/10 to-blue-600/20",
      iconBg: "bg-blue-500",
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: t('dashboard.quickActions.contracts'),
      description: t('dashboard.quickActions.contractsDesc'),
      icon: FileText,
      gradient: "from-emerald-500/10 to-emerald-600/20",
      iconBg: "bg-emerald-500",
      onClick: () => navigate('/admin/merchants/contracts')
    },
    {
      title: t('dashboard.quickActions.merchants'),
      description: t('dashboard.quickActions.merchantsDesc'),
      icon: Building2,
      gradient: "from-purple-500/10 to-purple-600/20",
      iconBg: "bg-purple-500",
      onClick: () => navigate('/admin/merchants')
    },
    {
      title: t('dashboard.quickActions.locations'),
      description: t('dashboard.quickActions.locationsDesc'),
      icon: BarChart3,
      gradient: "from-orange-500/10 to-orange-600/20",
      iconBg: "bg-orange-500",
      onClick: () => navigate('/admin/merchants/locations')
    },
    {
      title: t('dashboard.quickActions.team'),
      description: t('dashboard.quickActions.teamDesc'),
      icon: Users,
      gradient: "from-cyan-500/10 to-cyan-600/20",
      iconBg: "bg-cyan-500",
      onClick: () => navigate('/admin/team/performance')
    }
  ];

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground font-semibold tracking-tight">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-3",
          isMobile 
            ? "grid-cols-2" 
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        )}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size={isMobile ? "mobile-touch" : "default"}
              className={cn(
                "h-auto p-4 bg-gradient-to-br border-border",
                "hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5",
                "transition-all duration-300 ease-out group relative overflow-hidden",
                "flex-col space-y-3 items-center justify-center text-center",
                action.gradient
              )}
              onClick={action.onClick}
            >
              <div className={cn(
                "p-3 rounded-lg shadow-sm border border-white/20",
                "group-hover:scale-110 transition-all duration-300",
                action.iconBg
              )}>
                <action.icon className={cn(
                  "text-white",
                  isMobile ? "h-5 w-5" : "h-4 w-4"
                )} />
              </div>
              <div className="space-y-1">
                <div className={cn(
                  "font-semibold text-foreground leading-tight",
                  isMobile ? "text-sm" : "text-xs"
                )}>
                  {action.title}
                </div>
                <div className={cn(
                  "text-muted-foreground leading-tight",
                  isMobile ? "text-xs" : "text-xs"
                )}>
                  {action.description}
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
