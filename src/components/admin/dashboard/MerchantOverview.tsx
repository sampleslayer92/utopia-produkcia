import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from 'react-i18next';
import { Building2, MapPin, CreditCard, TrendingUp, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMerchantOverview } from "@/hooks/useMerchantOverview";

const MerchantOverview = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { data: merchantData, isLoading } = useMerchantOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200/60 bg-white backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              {t('dashboard.merchantOverview.topMerchants')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 bg-white backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              {t('dashboard.merchantOverview.geographicDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPerformanceBadge = (profit: number) => {
    if (profit >= 1000) return { color: "bg-green-100 text-green-700", label: t('dashboard.team.excellent') };
    if (profit >= 500) return { color: "bg-blue-100 text-blue-700", label: t('dashboard.team.good') };
    if (profit >= 100) return { color: "bg-yellow-100 text-yellow-700", label: t('dashboard.team.average') };
    return { color: "bg-slate-100 text-slate-700", label: t('dashboard.team.needsImprovement') };
  };

  const topMerchants = merchantData?.topMerchants?.slice(0, 5) || [];
  const topCities = merchantData?.topCities || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Merchants */}
      <Card className="border-slate-200/60 bg-white backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              {t('dashboard.merchantOverview.topMerchants')}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/admin/merchants')}
              className="text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-4 w-4 mr-1" />
              {t('dashboard.merchantOverview.viewAllMerchants')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => {
              const badge = getPerformanceBadge(merchant.totalProfit);
              return (
                <div 
                  key={merchant.id} 
                  className="flex items-center space-x-3 p-3 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/merchant/${merchant.id}/view`)}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                    {index + 1}
                  </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-medium">
                      {merchant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-slate-900 truncate">{merchant.name}</h4>
                      <Badge className={`${badge.color} text-xs px-2 py-1`}>
                        €{merchant.totalProfit.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="flex items-center">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {merchant.activeContracts} {t('dashboard.merchantOverview.contracts')}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {merchant.city || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{t('dashboard.merchantOverview.efficiency')}</span>
                        <span>{merchant.efficiency}%</span>
                      </div>
                      <Progress value={merchant.efficiency} className="h-1" />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {topMerchants.length === 0 && (
              <div className="text-center py-6 text-slate-500">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('dashboard.merchantOverview.noMerchants')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card className="border-slate-200/60 bg-white backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <MapPin className="h-5 w-5 mr-2 text-green-600" />
            {t('dashboard.merchantOverview.geographicDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCities.map((cityData, index) => {
              const percentage = merchantData?.totalMerchants 
                ? Math.round((cityData.count / merchantData.totalMerchants) * 100)
                : 0;
              
              return (
                <div key={cityData.city} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' : 
                        index === 1 ? 'bg-blue-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        index === 3 ? 'bg-purple-500' : 'bg-slate-400'
                      }`}></div>
                      <span className="font-medium text-sm text-slate-900">{cityData.city}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-slate-900">{cityData.count}</span>
                      <span className="text-xs text-slate-500 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            
            {topCities.length === 0 && (
              <div className="text-center py-6 text-slate-500">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('dashboard.merchantOverview.noLocationData')}</p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="pt-4 border-t border-slate-200 mt-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {merchantData?.totalMerchants || 0}
                  </div>
                  <div className="text-xs text-slate-600">{t('dashboard.merchantOverview.totalMerchants')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {merchantData?.totalLocations || 0}
                  </div>
                  <div className="text-xs text-slate-600">{t('dashboard.merchantOverview.totalLocations')}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantOverview;