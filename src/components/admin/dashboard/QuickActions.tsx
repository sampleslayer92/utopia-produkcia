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
    <Card className="border-glass-border bg-glass-bg backdrop-blur-lg shadow-[var(--glass-shadow)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="text-foreground font-semibold tracking-tight">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {actions.map((action, index) => (
            <Card
              key={index}
              className={`${action.gradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 cursor-pointer transform hover:-translate-y-3 rounded-3xl overflow-hidden h-48 group`}
              onClick={action.onClick}
            >
              <CardContent className="p-8 h-full relative">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-6 translate-x-6"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex-1">
                    <h3 className="font-black text-xl text-white mb-3 leading-tight">
                      {action.title}
                    </h3>
                    <p className="text-base font-semibold text-white/90 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex justify-end mt-6">
                    <div className={`p-4 rounded-2xl ${action.iconBg} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;