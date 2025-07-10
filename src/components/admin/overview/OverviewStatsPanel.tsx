import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Euro, Users, Clock, CheckCircle } from 'lucide-react';
import { EnhancedContractData } from '@/hooks/useEnhancedContractsData';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

interface OverviewStatsPanelProps {
  contracts: EnhancedContractData[];
  isLoading?: boolean;
}

const OverviewStatsPanel = ({ contracts, isLoading = false }: OverviewStatsPanelProps) => {
  const { t } = useTranslation('admin');

  if (isLoading) {
    return (
      <div className="border-b border-border bg-background/50 p-3">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-none shadow-none bg-transparent">
              <CardContent className="p-3">
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-6 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalValue = contracts.reduce((sum, contract) => sum + (contract.contractValue || 0), 0);
  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === 'signed').length;
  const pendingContracts = contracts.filter(c => c.status !== 'signed' && c.status !== 'lost' && c.status !== 'rejected').length;
  const lostContracts = contracts.filter(c => c.status === 'lost' || c.status === 'rejected').length;
  
  // Calculate conversion rate
  const conversionRate = totalContracts > 0 ? (signedContracts / totalContracts) * 100 : 0;
  
  // Calculate average deal value
  const avgDealValue = signedContracts > 0 ? totalValue / signedContracts : 0;

  const stats = [
    {
      title: t('overview.stats.totalPipelineValue'),
      value: `€${totalValue.toLocaleString()}`,
      subtitle: `${totalContracts} ${t('overview.stats.deals')}`,
      icon: Euro,
      iconColor: 'bg-green-500',
      trend: null
    },
    {
      title: t('overview.stats.conversionRate'),
      value: `${conversionRate.toFixed(1)}%`,
      subtitle: `${signedContracts}/${totalContracts} ${t('overview.stats.converted')}`,
      icon: TrendingUp,
      iconColor: 'bg-blue-500',
      trend: conversionRate > 20 ? { value: 'Dobrá', isPositive: true } : null
    },
    {
      title: t('overview.stats.avgDealValue'),
      value: `€${avgDealValue.toLocaleString()}`,
      subtitle: t('overview.stats.perSignedDeal'),
      icon: Euro,
      iconColor: 'bg-purple-500',
      trend: null
    },
    {
      title: t('overview.stats.activePipeline'),
      value: pendingContracts.toString(),
      subtitle: t('overview.stats.inProgress'),
      icon: Clock,
      iconColor: 'bg-orange-500',
      trend: null
    },
    {
      title: t('overview.stats.signedDeals'),
      value: signedContracts.toString(),
      subtitle: t('overview.stats.completed'),
      icon: CheckCircle,
      iconColor: 'bg-green-600',
      trend: null
    },
    {
      title: t('overview.stats.lostDeals'),
      value: lostContracts.toString(),
      subtitle: t('overview.stats.unsuccessful'),
      icon: TrendingDown,
      iconColor: 'bg-red-500',
      trend: null
    }
  ];

  return (
    <div className="border-b border-border bg-gradient-to-r from-background/50 to-background/80 p-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-none bg-white/60 hover:bg-white/80 transition-colors">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-1 rounded ${stat.iconColor}`}>
                  <stat.icon className="h-3 w-3 text-white" />
                </div>
                <h4 className="text-xs font-medium text-slate-700 truncate">{stat.title}</h4>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-lg font-bold text-slate-900 leading-tight">{stat.value}</p>
                <p className="text-xs text-slate-600 truncate">{stat.subtitle}</p>
                {stat.trend && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs h-4 ${stat.trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {stat.trend.value}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OverviewStatsPanel;