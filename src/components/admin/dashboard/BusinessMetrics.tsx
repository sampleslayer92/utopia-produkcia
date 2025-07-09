
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, CreditCard, Users } from "lucide-react";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";

const BusinessMetrics = () => {
  const { t } = useTranslation('admin');
  const { data: metrics, isLoading } = useBusinessMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="glass-card-solid">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded w-20 mb-2"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded w-16"></div>
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
    },
    {
      title: t('dashboard.metrics.activeContracts'),
      value: metrics?.activeContracts?.toLocaleString() || '0',
      change: `+${metrics?.contractGrowth || 0}%`,
      icon: CreditCard,
    },
    {
      title: t('dashboard.metrics.totalTurnover'),
      value: `€${metrics?.totalTurnover?.toLocaleString() || '0'}`,
      change: `+${metrics?.turnoverGrowth || 0}%`,
      icon: TrendingUp,
    },
    {
      title: t('dashboard.metrics.totalMerchants'),
      value: metrics?.totalMerchants?.toLocaleString() || '0',
      change: `+${metrics?.merchantGrowth || 0}%`,
      icon: Users,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => {
        const isDark = index % 2 === 0;
        return (
          <Card key={index} className={`${isDark ? 'glass-card-dark' : 'glass-card-solid'} hover-scale cursor-pointer group overflow-hidden border-0`}>
            <div className={`absolute inset-0 ${isDark ? 'gradient-accent' : 'gradient-primary'} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
            <CardContent className="p-6 relative">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${isDark ? 'gradient-bright' : 'gradient-primary'} shadow-lg group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className={`text-xs font-medium mb-1 uppercase tracking-wide ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {metric.title}
                  </p>
                  <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white text-gradient-bright' : 'text-foreground text-gradient'}`}>
                    {metric.value}
                  </p>
                  <p className={`text-xs font-medium flex items-center gap-1 ${isDark ? 'text-accent-cyan' : 'text-primary'}`}>
                    <span className={`inline-block w-2 h-2 rounded-full ${isDark ? 'bg-accent-cyan' : 'bg-primary'}`}></span>
                    {metric.change} {t('dashboard.metrics.fromPreviousMonth')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BusinessMetrics;
