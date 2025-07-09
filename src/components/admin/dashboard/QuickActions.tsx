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
      gradient: "bg-bold-blue",
      iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: t('dashboard.quickActions.contracts'),
      description: t('dashboard.quickActions.contractsDesc'),
      icon: FileText,
      gradient: "bg-bold-emerald",
      iconBg: "bg-gradient-to-br from-emerald-400 to-green-500",
      onClick: () => navigate('/admin/merchants/contracts')
    },
    {
      title: t('dashboard.quickActions.merchants'),
      description: t('dashboard.quickActions.merchantsDesc'),
      icon: Building2,
      gradient: "bg-bold-purple",
      iconBg: "bg-gradient-to-br from-purple-400 to-violet-500",
      onClick: () => navigate('/admin/merchants')
    },
    {
      title: t('dashboard.quickActions.locations'),
      description: t('dashboard.quickActions.locationsDesc'),
      icon: BarChart3,
      gradient: "bg-bold-orange",
      iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
      onClick: () => navigate('/admin/merchants/locations')
    },
    {
      title: t('dashboard.quickActions.team'),
      description: t('dashboard.quickActions.teamDesc'),
      icon: Users,
      gradient: "bg-bold-cyan",
      iconBg: "bg-gradient-to-br from-cyan-400 to-teal-500",
      onClick: () => navigate('/admin/team/performance')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {t('dashboard.quickActions.title')}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <Card
            key={index}
            className="cursor-pointer bg-card border-border/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
            onClick={action.onClick}
          >
            <CardContent className="p-8 relative">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 bg-muted/30 rounded-2xl group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                  <action.icon className="h-8 w-8 text-primary group-hover:text-primary transition-colors duration-300" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;