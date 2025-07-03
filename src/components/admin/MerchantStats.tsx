
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Euro, Package, TrendingUp, Building2, CreditCard } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MerchantStatsProps {
  statistics: {
    total_contracts: number;
    total_monthly_profit: number;
    total_devices: number;
    avg_contract_value: number;
    latest_contract_date: string | null;
    total_locations: number;
    total_estimated_turnover: number;
    locations_with_pos: number;
  };
}

const MerchantStats = ({ statistics }: MerchantStatsProps) => {
  const { t } = useTranslation('admin');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.totalContracts')}
          </CardTitle>
          <FileText className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {statistics.total_contracts}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.monthlyProfit')}
          </CardTitle>
          <Euro className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            €{statistics.total_monthly_profit.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.totalDevices')}
          </CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {statistics.total_devices}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.avgContractValue')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            €{statistics.avg_contract_value.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.locations')}
          </CardTitle>
          <Building2 className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {statistics.total_locations}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {statistics.locations_with_pos} {t('merchants.detail.stats.withPosTerminal')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {t('merchants.detail.stats.plannedTurnover')}
          </CardTitle>
          <Euro className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            €{statistics.total_estimated_turnover.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 mt-1">
            {t('merchants.detail.stats.fromAllLocations')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantStats;
