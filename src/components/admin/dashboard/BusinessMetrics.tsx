
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, CreditCard, Users } from "lucide-react";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";

const BusinessMetrics = () => {
  const { t } = useTranslation('admin');
  const { data: metrics, isLoading } = useBusinessMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: t('dashboard.metrics.totalRevenue'),
      value: `€${metrics?.monthlyRevenue?.toLocaleString() || '0'}`,
      change: `+${metrics?.revenueGrowth || 0}%`,
      icon: DollarSign,
      gradient: "bg-bold-emerald",
      iconBg: "bg-gradient-to-br from-emerald-400 to-green-500",
      textColor: "text-white"
    },
    {
      title: t('dashboard.metrics.activeContracts'),
      value: metrics?.activeContracts?.toLocaleString() || '0',
      change: `+${metrics?.contractGrowth || 0}%`,
      icon: CreditCard,
      gradient: "bg-bold-blue",
      iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
      textColor: "text-white"
    },
    {
      title: t('dashboard.metrics.totalTurnover'),
      value: `€${metrics?.totalTurnover?.toLocaleString() || '0'}`,
      change: `+${metrics?.turnoverGrowth || 0}%`,
      icon: TrendingUp,
      gradient: "bg-bold-purple",
      iconBg: "bg-gradient-to-br from-purple-400 to-violet-500",
      textColor: "text-white"
    },
    {
      title: t('dashboard.metrics.totalMerchants'),
      value: metrics?.totalMerchants?.toLocaleString() || '0',
      change: `+${metrics?.merchantGrowth || 0}%`,
      icon: Users,
      gradient: "bg-bold-orange",
      iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <Card key={index} className="bg-white border border-gray-200 hover:border-hsl(var(--lime-300)) transition-all duration-200 hover:shadow-md rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <p className="text-sm text-hsl(var(--lime-600)) font-medium">
                  {metric.change} {t('dashboard.metrics.fromPreviousMonth')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50">
                <metric.icon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusinessMetrics;
