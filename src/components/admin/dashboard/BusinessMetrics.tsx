
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
      {metricsData.map((metric, index) => (
        <Card
          key={index}
          className={`
            ${index % 2 === 0 ? 'glass-card hover-lift' : 'glass-card-dark hover-lift'}
            transition-all duration-200 border-0 overflow-hidden group
          `}
        >
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg shadow-md ${
                index % 2 === 0 ? 'gradient-accent' : 'bg-white/15'
              }`}>
                <metric.icon className={`h-5 w-5 ${
                  index % 2 === 0 ? 'text-white' : 'text-white'
                }`} />
              </div>
              {metric.change && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  metric.change.startsWith('+') 
                    ? 'bg-accent-lime/20 text-accent-lime' 
                    : metric.change.startsWith('-')
                    ? 'bg-accent-coral/20 text-accent-coral'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {metric.change}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <p className={`text-4xl font-bold tracking-tight ${
                index % 2 === 0 ? 'text-foreground' : 'text-white'
              }`}>
                {metric.value}
              </p>
              <h3 className={`text-sm font-medium ${
                index % 2 === 0 ? 'text-muted-foreground' : 'text-white/70'
              }`}>
                {metric.title}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusinessMetrics;
