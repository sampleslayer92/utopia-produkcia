
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
          <Card key={i} className="bg-card border-border shadow-elevation-2">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
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
      variant: "light" as const
    },
    {
      title: t('dashboard.metrics.activeContracts'),
      value: metrics?.activeContracts?.toLocaleString() || '0',
      change: `+${metrics?.contractGrowth || 0}%`,
      icon: CreditCard,
      variant: "dark" as const
    },
    {
      title: t('dashboard.metrics.totalTurnover'),
      value: `€${metrics?.totalTurnover?.toLocaleString() || '0'}`,
      change: `+${metrics?.turnoverGrowth || 0}%`,
      icon: TrendingUp,
      variant: "light" as const
    },
    {
      title: t('dashboard.metrics.totalMerchants'),
      value: metrics?.totalMerchants?.toLocaleString() || '0',
      change: `+${metrics?.merchantGrowth || 0}%`,
      icon: Users,
      variant: "dark" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => {
        const isLight = metric.variant === "light";
        return (
          <Card 
            key={index} 
            className={`${
              isLight 
                ? "bg-card border-border shadow-elevation-2" 
                : "bg-card-dark border-card-dark"
            } hover:shadow-elevation-3 transition-all duration-300 hover:scale-105 cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    isLight ? "text-muted-foreground" : "text-card-dark-foreground/70"
                  }`}>
                    {metric.title}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${
                    isLight ? "text-foreground" : "text-card-dark-foreground"
                  }`}>
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium mt-1 text-primary">
                    {metric.change} {t('dashboard.metrics.fromPreviousMonth')}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  isLight ? "bg-primary/10" : "bg-primary/20"
                } shadow-sm`}>
                  <metric.icon className="h-6 w-6 text-primary" />
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
