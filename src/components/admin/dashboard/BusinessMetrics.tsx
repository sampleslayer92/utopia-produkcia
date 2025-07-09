
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {metricsData.map((metric, index) => (
        <Card key={index} className={`${metric.gradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 cursor-pointer transform hover:-translate-y-2 rounded-3xl overflow-hidden`}>
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="text-base font-bold text-white/90 mb-3">{metric.title}</p>
                  <p className="text-4xl xl:text-5xl font-black text-white mb-3 tracking-tight">{metric.value}</p>
                  <p className="text-lg font-bold text-white/90">
                    {metric.change} {t('dashboard.metrics.fromPreviousMonth')}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${metric.iconBg} shadow-xl`}>
                  <metric.icon className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusinessMetrics;
