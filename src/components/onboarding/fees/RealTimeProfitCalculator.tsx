
import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnboardingData, ItemBreakdown } from "@/types/onboarding";
import { formatCurrency, formatCurrencyWithColor, formatPercentage } from "../utils/currencyUtils";
import { useTranslation } from "react-i18next";

interface RealTimeProfitCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const RealTimeProfitCalculator = ({ data, updateData }: RealTimeProfitCalculatorProps) => {
  const { t } = useTranslation('forms');
  
  // Local state for unified MIF++ rate with debounced updates
  const [localMifRate, setLocalMifRate] = useState(data.fees.regulatedCards);

  // Calculate monthly turnover from all business locations (using both old and new field names for compatibility)
  const monthlyTurnover = useMemo(() => {
    const turnover = data.businessLocations.reduce((sum, location) => {
      // Use new field first, fallback to old field for backward compatibility
      const locationTurnover = location.monthlyTurnover || location.estimatedTurnover || 0;
      console.log(`Location ${location.name || 'Unnamed'}: ${locationTurnover} EUR`);
      return sum + locationTurnover;
    }, 0);
    
    console.log(`Total monthly turnover calculated: ${turnover} EUR from ${data.businessLocations.length} locations`);
    return turnover;
  }, [data.businessLocations]);

  // Calculate total customer payments from devices and services
  const totalCustomerPayments = useMemo(() => {
    return data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemTotal = card.count * card.monthlyFee;
      const addonsTotal = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.monthlyFee);
      }, 0);
      return sum + mainItemTotal + addonsTotal;
    }, 0);
  }, [data.deviceSelection.dynamicCards]);

  // Calculate total company costs
  const totalCompanyCosts = useMemo(() => {
    return data.deviceSelection.dynamicCards.reduce((sum, card) => {
      const mainItemCost = card.count * card.companyCost;
      const addonsCost = (card.addons || []).reduce((addonSum, addon) => {
        const quantity = addon.isPerDevice ? card.count : (addon.customQuantity || 1);
        return addonSum + (quantity * addon.companyCost);
      }, 0);
      return sum + mainItemCost + addonsCost;
    }, 0);
  }, [data.deviceSelection.dynamicCards]);

  // Unified calculation - no split between regulated/unregulated
  const calculations = useMemo(() => {
    const effectiveMifRate = Math.max(0, localMifRate - 0.2);
    
    // Single transaction fee calculation for all cards
    const transactionMargin = monthlyTurnover * (effectiveMifRate / 100);
    const serviceMargin = totalCustomerPayments - totalCompanyCosts;
    const totalMonthlyProfit = transactionMargin + serviceMargin;

    console.log('Unified calculations updated:', {
      monthlyTurnover,
      effectiveMifRate,
      transactionMargin,
      serviceMargin,
      totalMonthlyProfit
    });

    return {
      monthlyTurnover,
      totalCustomerPayments,
      totalCompanyCosts,
      effectiveRate: effectiveMifRate,
      transactionMargin,
      serviceMargin,
      totalMonthlyProfit
    };
  }, [monthlyTurnover, totalCustomerPayments, totalCompanyCosts, localMifRate]);

  // Force re-calculation when business locations change
  useEffect(() => {
    console.log('Business locations changed, forcing calculator update');
    console.log('Current business locations:', data.businessLocations);
  }, [data.businessLocations]);

  // Debounced update to global state (unified rate for both regulated and unregulated)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Create detailed breakdowns for compatibility
      const customerPaymentBreakdown = data.deviceSelection.dynamicCards.map(card => ({
        id: card.id,
        name: card.name,
        count: card.count,
        unitPrice: card.monthlyFee,
        subtotal: card.count * card.monthlyFee,
        addons: (card.addons || []).map(addon => ({
          id: addon.id,
          name: addon.name,
          count: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
          unitPrice: addon.monthlyFee,
          subtotal: (addon.isPerDevice ? card.count : (addon.customQuantity || 1)) * addon.monthlyFee
        }))
      }));

      const companyCostBreakdown = data.deviceSelection.dynamicCards.map(card => ({
        id: card.id,
        name: card.name,
        count: card.count,
        unitPrice: card.companyCost,
        subtotal: card.count * card.companyCost,
        addons: (card.addons || []).map(addon => ({
          id: addon.id,
          name: addon.name,
          count: addon.isPerDevice ? card.count : (addon.customQuantity || 1),
          unitPrice: addon.companyCost,
          subtotal: (addon.isPerDevice ? card.count : (addon.customQuantity || 1)) * addon.companyCost
        }))
      }));

      updateData({
        fees: {
          ...data.fees,
          regulatedCards: localMifRate,
          unregulatedCards: localMifRate, // Keep both for compatibility but use same value
          calculatorResults: {
            monthlyTurnover: calculations.monthlyTurnover,
            totalCustomerPayments: calculations.totalCustomerPayments,
            totalCompanyCosts: calculations.totalCompanyCosts,
            effectiveRegulated: calculations.effectiveRate,
            effectiveUnregulated: calculations.effectiveRate,
            regulatedFee: calculations.transactionMargin, // For compatibility
            unregulatedFee: 0, // Not used anymore
            transactionMargin: calculations.transactionMargin,
            serviceMargin: calculations.serviceMargin,
            totalMonthlyProfit: calculations.totalMonthlyProfit,
            customerPaymentBreakdown,
            companyCostBreakdown
          }
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localMifRate, calculations, data.deviceSelection.dynamicCards, data.fees, updateData]);

  const handleMifRateChange = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalMifRate(numValue);
  }, []);

  // Show turnover breakdown for transparency
  const turnoverBreakdown = useMemo(() => {
    return data.businessLocations.map(location => ({
      name: location.name || t('fees.calculator.inputs.monthlyTurnover.breakdown'),
      turnover: location.monthlyTurnover || location.estimatedTurnover || 0
    })).filter(item => item.turnover > 0);
  }, [data.businessLocations, t]);

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          {t('fees.calculator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {t('fees.calculator.inputs.title')}
            </h3>
            
            {/* Monthly Turnover - Read Only with breakdown */}
            <div className="space-y-2">
              <Label className="text-slate-700">
                {t('fees.calculator.inputs.monthlyTurnover.label')}
              </Label>
              <Input
                type="text"
                value={formatCurrency(monthlyTurnover)}
                readOnly
                className="bg-slate-50 border-slate-300 text-slate-600"
              />
              <div className="text-xs text-slate-500">
                <p>{t('fees.calculator.inputs.monthlyTurnover.description')}</p>
                {turnoverBreakdown.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="font-medium">{t('fees.calculator.inputs.monthlyTurnover.breakdown')}</p>
                    {turnoverBreakdown.map((item, index) => (
                      <p key={index} className="ml-2">
                        • {item.name}: {formatCurrency(item.turnover)}
                      </p>
                    ))}
                  </div>
                )}
                {turnoverBreakdown.length === 0 && monthlyTurnover === 0 && (
                  <p className="text-amber-600 font-medium mt-1">
                    {t('fees.calculator.inputs.monthlyTurnover.noTurnoverWarning')}
                  </p>
                )}
              </div>
            </div>

            {/* Unified MIF++ Rate */}
            <div className="space-y-2">
              <Label htmlFor="mifRate" className="flex items-center gap-2">
                {t('fees.calculator.inputs.mifRate.label')}
                <Info className="h-4 w-4 text-slate-400" />
              </Label>
              <Input
                id="mifRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={localMifRate}
                onChange={(e) => handleMifRateChange(e.target.value)}
                className="border-slate-300 focus:border-green-500"
                placeholder={t('fees.calculator.inputs.mifRate.placeholder')}
              />
              <div className="space-y-1 text-sm">
                <p className="text-green-600">
                  {t('fees.calculator.inputs.mifRate.effectiveRate', { 
                    rate: formatPercentage(calculations.effectiveRate) 
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {t('fees.calculator.inputs.mifRate.description')}
                </p>
              </div>
            </div>

            {/* Simplified calculation info */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                {t('fees.calculator.results.calculationBreakdown.title')}
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>{t('fees.calculator.results.calculationBreakdown.totalTurnover', { amount: formatCurrency(calculations.monthlyTurnover) })}</p>
                <p>{t('fees.calculator.results.calculationBreakdown.effectiveRate', { rate: formatPercentage(calculations.effectiveRate) })}</p>
                <p>{t('fees.calculator.results.calculationBreakdown.transactionFee', { amount: formatCurrency(calculations.transactionMargin) })}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Live Results */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {t('fees.calculator.results.title')}
            </h3>
            
            {/* Revenue from Transactions - Simplified */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {t('fees.calculator.results.transactionRevenue.title')}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('fees.calculator.results.transactionRevenue.totalTurnover')}</span>
                    <span className="text-slate-600">{formatCurrency(calculations.monthlyTurnover)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('fees.calculator.results.transactionRevenue.effectiveRate')}</span>
                    <span className="text-slate-600">{formatPercentage(calculations.effectiveRate)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-blue-300">
                    <span>{t('fees.calculator.results.transactionRevenue.transactionIncome')}</span>
                    <span className={`${formatCurrencyWithColor(calculations.transactionMargin).className}`}>
                      {formatCurrencyWithColor(calculations.transactionMargin).value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Payments vs Company Costs */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{t('fees.calculator.results.serviceMargin.customerPayments')}</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(totalCustomerPayments)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('fees.calculator.results.serviceMargin.companyCosts')}</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(totalCompanyCosts)}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-slate-300">
                    <span>{t('fees.calculator.results.serviceMargin.serviceMargin')}</span>
                    <span className={`${formatCurrencyWithColor(calculations.serviceMargin).className}`}>
                      {formatCurrencyWithColor(calculations.serviceMargin).value}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Monthly Profit */}
            <Card className={`${calculations.totalMonthlyProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {calculations.totalMonthlyProfit >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold text-slate-900">
                      {t('fees.calculator.results.totalProfit.title')}
                    </span>
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
                    <span>{t('fees.calculator.results.totalProfit.breakdown.transactionRevenue')}</span>
                    <span>{formatCurrency(calculations.transactionMargin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('fees.calculator.results.totalProfit.breakdown.serviceMargin')}</span>
                    <span>{formatCurrency(calculations.serviceMargin)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeProfitCalculator;
