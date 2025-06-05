
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { formatCurrency, formatCurrencyWithColor } from "../utils/currencyUtils";

interface ProfitSummaryProps {
  data: OnboardingData;
}

const ProfitSummary = ({ data }: ProfitSummaryProps) => {
  // Calculate monthly turnover from business locations
  const monthlyTurnover = useMemo(() => {
    const turnover = data.businessLocations.reduce((sum, location) => {
      const locationTurnover = location.monthlyTurnover || 0;
      return sum + locationTurnover;
    }, 0);
    
    console.log(`Total monthly turnover: ${turnover} EUR from ${data.businessLocations.length} locations`);
    return turnover;
  }, [data.businessLocations]);

  // Calculate device/service costs
  const { totalCustomerPayments, totalCompanyCosts } = useMemo(() => {
    const customerPayments = data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemTotal = card.count * card.monthlyFee;
      const addonsTotal = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.monthlyFee);
      }, 0);
      return sum + mainItemTotal + addonsTotal;
    }, 0);

    const companyCosts = data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemCost = card.count * card.companyCost;
      const addonsCost = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.companyCost);
      }, 0);
      return sum + mainItemCost + addonsCost;
    }, 0);

    return { totalCustomerPayments: customerPayments, totalCompanyCosts: companyCosts };
  }, [data.deviceSelection.dynamicCards]);

  // Calculate profits
  const calculations = useMemo(() => {
    const effectiveRegulated = Math.max(0, data.fees.regulatedCards - 0.2);
    const effectiveUnregulated = Math.max(0, data.fees.unregulatedCards - 0.2);
    
    const regulatedFee = monthlyTurnover * (effectiveRegulated / 100);
    const unregulatedFee = monthlyTurnover * (effectiveUnregulated / 100);
    const transactionMargin = regulatedFee + unregulatedFee;
    const serviceMargin = totalCustomerPayments - totalCompanyCosts;
    const totalMonthlyProfit = transactionMargin + serviceMargin;

    return {
      regulatedFee,
      unregulatedFee,
      transactionMargin,
      serviceMargin,
      totalMonthlyProfit
    };
  }, [monthlyTurnover, totalCustomerPayments, totalCompanyCosts, data.fees.regulatedCards, data.fees.unregulatedCards]);

  // Turnover breakdown for transparency
  const turnoverBreakdown = useMemo(() => {
    return data.businessLocations
      .map(location => ({
        name: location.name || 'Nepomenovaná prevádzka',
        turnover: location.monthlyTurnover || 0
      }))
      .filter(item => item.turnover > 0);
  }, [data.businessLocations]);

  return (
    <div className="space-y-4">
      {/* Monthly Turnover Overview */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-slate-900">Mesačný obrat celkom:</span>
            <span className="text-lg font-semibold text-slate-900">
              {formatCurrency(monthlyTurnover)}
            </span>
          </div>
          
          {turnoverBreakdown.length > 0 ? (
            <div className="space-y-1 text-xs text-slate-600">
              {turnoverBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>• {item.name}:</span>
                  <span>{formatCurrency(item.turnover)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Žiadny obrat nie je zadaný v prevádzkach</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Revenue */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Výnos z transakcií</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Regulované karty:</span>
              <span className={`font-medium ${formatCurrencyWithColor(calculations.regulatedFee).className}`}>
                {formatCurrencyWithColor(calculations.regulatedFee).value}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Neregulované karty:</span>
              <span className={`font-medium ${formatCurrencyWithColor(calculations.unregulatedFee).className}`}>
                {formatCurrencyWithColor(calculations.unregulatedFee).value}
              </span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-blue-300">
              <span>Spolu tržba:</span>
              <span className={`${formatCurrencyWithColor(calculations.transactionMargin).className}`}>
                {formatCurrencyWithColor(calculations.transactionMargin).value}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Margin */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-4">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>💼 Platby od klienta:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(totalCustomerPayments)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>🔧 Vaše náklady:</span>
              <span className="font-medium text-red-600">
                {formatCurrency(totalCompanyCosts)}
              </span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-slate-300">
              <span>Marža zo služieb:</span>
              <span className={`${formatCurrencyWithColor(calculations.serviceMargin).className}`}>
                {formatCurrencyWithColor(calculations.serviceMargin).value}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Profit */}
      <Card className={`${calculations.totalMonthlyProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {calculations.totalMonthlyProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span className="font-semibold text-slate-900">Celkový mesačný zisk:</span>
            </div>
            <Badge 
              variant={calculations.totalMonthlyProfit >= 0 ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {formatCurrency(calculations.totalMonthlyProfit)}
            </Badge>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Tržba z transakcií:</span>
              <span>{formatCurrency(calculations.transactionMargin)}</span>
            </div>
            <div className="flex justify-between">
              <span>+ Marža zo služieb:</span>
              <span>{formatCurrency(calculations.serviceMargin)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfitSummary;
