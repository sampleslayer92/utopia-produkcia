
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
      variant: "accent" as const
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
      variant: "primary" as const
    }
  ];

  const getCardClasses = (variant: "light" | "dark" | "accent" | "primary") => {
    switch (variant) {
      case "dark":
        return "bg-card-dark border-card-dark shadow-elevation-2 hover:shadow-elevation-3";
      case "accent":
        return "bg-accent border-accent shadow-elevation-2 hover:shadow-elevation-floating";
      case "primary":
        return "bg-primary border-primary shadow-elevation-2 hover:shadow-elevation-floating";
      default:
        return "bg-card border-border shadow-elevation-1 hover:shadow-elevation-2";
    }
  };

  const getTextClasses = (variant: "light" | "dark" | "accent" | "primary") => {
    switch (variant) {
      case "dark":
        return {
          title: "text-card-dark-foreground/80",
          value: "text-card-dark-foreground",
          icon: "text-card-dark-foreground/80",
          change: "text-accent"
        };
      case "accent":
        return {
          title: "text-accent-foreground/90",
          value: "text-accent-foreground",
          icon: "text-accent-foreground/90",
          change: "text-primary"
        };
      case "primary":
        return {
          title: "text-primary-foreground/90",
          value: "text-primary-foreground",
          icon: "text-primary-foreground/90",
          change: "text-accent"
        };
      default:
        return {
          title: "text-muted-foreground",
          value: "text-foreground",
          icon: "text-muted-foreground",
          change: "text-primary"
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => {
        const cardClasses = getCardClasses(metric.variant);
        const textClasses = getTextClasses(metric.variant);
        
        return (
          <Card 
            key={index} 
            className={`${cardClasses} transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${textClasses.title} mb-2`}>
                    {metric.title}
                  </p>
                  <p className={`text-4xl font-bold tracking-tight ${textClasses.value} mb-2`}>
                    {metric.value}
                  </p>
                  <p className={`text-sm font-medium ${textClasses.change}`}>
                    {metric.change} {t('dashboard.metrics.fromPreviousMonth')}
                  </p>
                </div>
                <div className="flex-shrink-0 p-4 rounded-2xl bg-white/20 shadow-lg">
                  <metric.icon className={`h-8 w-8 ${textClasses.icon}`} />
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
