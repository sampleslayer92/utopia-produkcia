import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Trophy, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMerchantOverview } from "@/hooks/useMerchantOverview";

const MerchantOverview = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data, isLoading } = useMerchantOverview();

  const getPerformanceBadge = (profit: number) => {
    if (profit >= 10000) {
      return { color: "bg-green-500/10 text-green-600 border border-green-500/20", label: t('dashboard.merchants.excellent') };
    } else if (profit >= 5000) {
      return { color: "bg-primary/10 text-primary border border-primary/20", label: t('dashboard.merchants.good') };
    } else if (profit >= 2000) {
      return { color: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20", label: t('dashboard.merchants.average') };
    } else {
      return { color: "bg-red-500/10 text-red-600 border border-red-500/20", label: t('dashboard.merchants.poor') };
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card-solid">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 glass-card">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-xl animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-2 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card-dark border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl animate-pulse"></div>
              <div className="h-5 bg-white/20 rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                      <div className="h-3 bg-white/20 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="h-3 bg-white/20 rounded w-12 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Merchants */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
            <div className="p-2 rounded-xl gradient-primary">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            {t('dashboard.merchants.topMerchants')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {data?.topMerchants && data.topMerchants.length > 0 ? (
            <div className="space-y-3">
              {data.topMerchants.slice(0, 5).map((merchant, index) => {
                const badge = getPerformanceBadge(merchant.totalProfit);
                return (
                  <div key={merchant.id} className="group/item p-4 glass-card hover-scale cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="flex items-center justify-center w-10 h-10 gradient-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{merchant.name}</p>
                        <p className="text-xs text-muted-foreground">{merchant.city}</p>
                        <p className="text-xs font-medium text-emerald-600">€{merchant.totalProfit.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{merchant.activeContracts} {t('dashboard.merchants.contracts')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full mt-4 h-10 text-sm font-medium border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                onClick={() => navigate('/admin/merchants')}
              >
                {t('dashboard.merchants.viewAll')}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8 text-sm">
              {t('dashboard.merchants.noData')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="glass-card-dark hover-scale group border-0">
        <div className="absolute inset-0 gradient-accent opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-white">
            <div className="p-2 rounded-xl gradient-bright">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            {t('dashboard.merchants.geographicDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {data?.topCities && data.topCities.length > 0 ? (
            <div className="space-y-3">
              {data.topCities.slice(0, 6).map((location, index) => (
                <div key={location.city} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer group/item transition-all duration-200">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ 
                        background: `hsl(${180 + index * 40}, 100%, ${60 - index * 8}%)` 
                      }}
                    ></div>
                    <span className="font-medium text-white text-sm group-hover/item:text-accent-cyan transition-colors">{location.city}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-white">{location.count}</span>
                    <div className="text-xs text-white/70">({Math.round((location.count / (data?.totalMerchants || 1)) * 100)}%)</div>
                  </div>
                </div>
              ))}
              
              {/* Summary Stats */}
              <div className="border-t border-white/20 pt-4 mt-4 space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 text-sm">{t('dashboard.merchants.totalMerchants')}:</span>
                  <span className="font-bold text-sm text-white">{data?.totalMerchants || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 text-sm">{t('dashboard.merchants.totalLocations')}:</span>
                  <span className="font-bold text-sm text-white">{data?.totalLocations || 0}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-white/70 text-center py-8 text-sm">
              {t('dashboard.merchants.noLocationData')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantOverview;