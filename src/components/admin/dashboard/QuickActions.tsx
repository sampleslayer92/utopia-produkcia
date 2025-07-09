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
    <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {t('dashboard.quickActions.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {actions.map((action, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-lime-300 rounded-lg border border-gray-200 bg-white"
              onClick={action.onClick}
            >
              <CardContent className="p-6 h-32 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-lime-50">
                    <action.icon className="h-5 w-5 text-gray-600 group-hover:text-lime-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
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