
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { TrendingUp, DollarSign, CreditCard, Users, FileText, MapPin, Activity } from "lucide-react";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { CircularProgress } from "@/components/ui/circular-progress";

const BusinessMetrics = () => {
  const { t } = useTranslation('admin');
  const { data: metrics, isLoading } = useBusinessMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-card border-border/50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-20 w-20 bg-muted rounded-full mx-auto"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const metricsData = [
    {
      title: t('dashboard.metrics.totalMerchants'),
      value: metrics?.totalMerchants || 0,
      change: metrics?.merchantGrowth || 0,
      progress: Math.min(85, (metrics?.totalMerchants || 0) * 2),
      icon: Users,
      color: 'lime',
      size: 'large'
    },
    {
      title: t('dashboard.metrics.activeContracts'),
      value: metrics?.activeContracts || 0,
      change: metrics?.contractGrowth || 0,
      progress: Math.min(92, (metrics?.activeContracts || 0) * 3),
      icon: FileText,
      color: 'yellow',
      size: 'small'
    },
    {
      title: t('dashboard.metrics.monthlyRevenue'),
      value: `€${(metrics?.monthlyRevenue || 0).toLocaleString()}`,
      change: metrics?.revenueGrowth || 0,
      progress: Math.min(78, (metrics?.monthlyRevenue || 0) / 1000),
      icon: TrendingUp,
      color: 'lime',
      size: 'large',
      dark: true
    },
    {
      title: t('dashboard.metrics.totalTurnover'),
      value: `€${(metrics?.totalTurnover || 0).toLocaleString()}`,
      change: metrics?.turnoverGrowth || 0,
      progress: Math.min(95, (metrics?.totalTurnover || 0) / 2000),
      icon: DollarSign,
      color: 'yellow',
      size: 'small'
    },
    {
      title: t('dashboard.metrics.avgProfitPerMerchant'),
      value: `€${(metrics?.avgProfitPerMerchant || 0).toLocaleString()}`,
      change: 5.2,
      progress: 67,
      icon: Activity,
      color: 'lime',
      size: 'medium'
    },
    {
      title: t('dashboard.metrics.locationsWithPOS'),
      value: metrics?.locationsWithPOS || 0,
      change: 12.5,
      progress: Math.min(88, (metrics?.locationsWithPOS || 0) * 4),
      icon: MapPin,
      color: 'yellow',
      size: 'medium',
      dark: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon;
        const isLarge = metric.size === 'large';
        const isMedium = metric.size === 'medium';
        const isDark = metric.dark;
        
        return (
          <Card
            key={index}
            className={`
              ${isDark 
                ? 'bg-card-dark text-white border-slate-800' 
                : 'bg-card border-border/50'
              }
              ${isLarge ? 'md:col-span-2 lg:col-span-2' : ''}
              ${isMedium ? 'md:row-span-2' : ''}
              hover:shadow-xl transition-all duration-500 hover:-translate-y-1
            `}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={`
                  p-3 rounded-xl
                  ${isDark ? 'bg-white/10' : 'bg-muted/50'}
                `}>
                  <Icon className={`
                    h-6 w-6 
                    ${metric.color === 'lime' ? 'text-primary' : 'text-accent'}
                  `} />
                </div>
                <div className="text-right">
                  <div className={`
                    text-sm font-medium
                    ${isDark ? 'text-white/70' : 'text-muted-foreground'}
                  `}>
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 flex items-center justify-between">
                <div className="space-y-2">
                  <div className={`
                    ${isLarge ? 'text-4xl' : isMedium ? 'text-3xl' : 'text-2xl'} 
                    font-bold
                    ${isDark ? 'text-white' : 'text-foreground'}
                  `}>
                    {metric.value}
                  </div>
                  <div className={`
                    text-sm font-medium
                    ${isDark ? 'text-white/70' : 'text-muted-foreground'}
                  `}>
                    {metric.title}
                  </div>
                </div>
                
                {/* Circular Progress */}
                <div className="ml-4">
                  <CircularProgress
                    value={metric.progress}
                    size={isLarge ? 'lg' : isMedium ? 'md' : 'sm'}
                    color={metric.color as 'lime' | 'yellow'}
                    showValue={false}
                  />
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
