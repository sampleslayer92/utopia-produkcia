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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card-solid">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 glass-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card-solid">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-xl animate-pulse"></div>
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 glass-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-muted rounded-full animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Merchants */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-3 rounded-xl gradient-primary">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            {t('dashboard.merchants.topMerchants')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {data?.topMerchants && data.topMerchants.length > 0 ? (
            <div className="space-y-4">
              {data.topMerchants.slice(0, 5).map((merchant, index) => {
                const badge = getPerformanceBadge(merchant.totalProfit);
                return (
                  <div key={merchant.id} className="group/item p-6 glass-card hover-scale cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 gradient-primary text-primary-foreground rounded-xl text-lg font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-foreground text-lg">{merchant.name}</p>
                          <p className="text-muted-foreground font-medium">{merchant.city}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-xl text-gradient">€{merchant.totalProfit.toLocaleString()}</p>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-sm text-muted-foreground font-medium">{merchant.activeContracts} {t('dashboard.merchants.contracts')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                className="w-full mt-6 h-12 font-semibold border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300"
                onClick={() => navigate('/admin/merchants')}
              >
                {t('dashboard.merchants.viewAll')}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12 text-lg">
              {t('dashboard.merchants.noData')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="glass-card-solid hover-scale group">
        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
            <div className="p-3 rounded-xl gradient-primary">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            {t('dashboard.merchants.geographicDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {data?.topCities && data.topCities.length > 0 ? (
            <div className="space-y-6">
              {data.topCities.slice(0, 6).map((location, index) => (
                <div key={location.city} className="flex items-center justify-between p-4 glass-card hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 gradient-primary rounded-full shadow-sm"></div>
                    <span className="font-semibold text-foreground text-lg">{location.city}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="font-bold text-xl text-gradient">{location.count}</span>
                    <div className="text-sm text-muted-foreground font-medium">({Math.round((location.count / (data?.totalMerchants || 1)) * 100)}%)</div>
                  </div>
                </div>
              ))}
              
              {/* Summary Stats */}
              <div className="border-t border-border/50 pt-6 mt-6 space-y-4">
                <div className="flex justify-between items-center p-4 glass-card">
                  <span className="text-muted-foreground font-medium">{t('dashboard.merchants.totalMerchants')}:</span>
                  <span className="font-bold text-xl text-gradient">{data?.totalMerchants || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 glass-card">
                  <span className="text-muted-foreground font-medium">{t('dashboard.merchants.totalLocations')}:</span>
                  <span className="font-bold text-xl text-gradient">{data?.totalLocations || 0}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12 text-lg">
              {t('dashboard.merchants.noLocationData')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantOverview;