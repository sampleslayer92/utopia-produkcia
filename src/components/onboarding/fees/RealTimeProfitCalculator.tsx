
import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnboardingData, ItemBreakdown } from "@/types/onboarding";
import { formatCurrency, formatCurrencyWithColor, formatPercentage } from "../utils/currencyUtils";

interface RealTimeProfitCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const RealTimeProfitCalculator = ({ data, updateData }: RealTimeProfitCalculatorProps) => {
  // Local state for inputs with debounced updates
  const [localRegulatedRate, setLocalRegulatedRate] = useState(data.fees.regulatedCards);
  const [localUnregulatedRate, setLocalUnregulatedRate] = useState(data.fees.unregulatedCards);

  // Calculate monthly turnover from all business locations (using both old and new field names for compatibility)
  const monthlyTurnover = useMemo(() => {
    return data.businessLocations.reduce((sum, location) => {
      // Use new field first, fallback to old field for backward compatibility
      const turnover = location.monthlyTurnover || location.estimatedTurnover || 0;
      return sum + turnover;
    }, 0);
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

  // Real-time calculations
  const calculations = useMemo(() => {
    const effectiveRegulated = Math.max(0, localRegulatedRate - 0.2);
    const effectiveUnregulated = Math.max(0, localUnregulatedRate - 0.2);
    
    const regulatedFee = monthlyTurnover * (effectiveRegulated / 100);
    const unregulatedFee = monthlyTurnover * (effectiveUnregulated / 100);
    const transactionMargin = regulatedFee + unregulatedFee;
    const serviceMargin = totalCustomerPayments - totalCompanyCosts;
    const totalMonthlyProfit = transactionMargin + serviceMargin;

    return {
      monthlyTurnover,
      totalCustomerPayments,
      totalCompanyCosts,
      effectiveRegulated,
      effectiveUnregulated,
      regulatedFee,
      unregulatedFee,
      transactionMargin,
      serviceMargin,
      totalMonthlyProfit
    };
  }, [monthlyTurnover, totalCustomerPayments, totalCompanyCosts, localRegulatedRate, localUnregulatedRate]);

  // Debounced update to global state
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
          regulatedCards: localRegulatedRate,
          unregulatedCards: localUnregulatedRate,
          calculatorResults: {
            ...calculations,
            customerPaymentBreakdown,
            companyCostBreakdown
          }
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localRegulatedRate, localUnregulatedRate, calculations, data.deviceSelection.dynamicCards, data.fees, updateData]);

  const handleRegulatedRateChange = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalRegulatedRate(numValue);
  }, []);

  const handleUnregulatedRateChange = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalUnregulatedRate(numValue);
  }, []);

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Výnosová kalkulačka
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Vstupné údaje</h3>
            
            {/* Monthly Turnover - Read Only */}
            <div className="space-y-2">
              <Label className="text-slate-700">Odhadovaný mesačný obrat (EUR)</Label>
              <Input
                type="text"
                value={formatCurrency(monthlyTurnover)}
                readOnly
                className="bg-slate-50 border-slate-300 text-slate-600"
              />
              <p className="text-xs text-slate-500">Predvyplnené z údajov prevádzkární</p>
            </div>

            {/* Regulated Cards Rate */}
            <div className="space-y-2">
              <Label htmlFor="regulatedCards">MIF++ regulované karty (%)</Label>
              <Input
                id="regulatedCards"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={localRegulatedRate}
                onChange={(e) => handleRegulatedRateChange(e.target.value)}
                className="border-slate-300 focus:border-green-500"
                placeholder="0.90"
              />
              <p className="text-sm text-green-600">
                → Efektívna provízia: {formatPercentage(calculations.effectiveRegulated)}
              </p>
            </div>

            {/* Unregulated Cards Rate */}
            <div className="space-y-2">
              <Label htmlFor="unregulatedCards">MIF++ neregulované karty (%)</Label>
              <Input
                id="unregulatedCards"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={localUnregulatedRate}
                onChange={(e) => handleUnregulatedRateChange(e.target.value)}
                className="border-slate-300 focus:border-green-500"
                placeholder="1.50"
              />
              <p className="text-sm text-green-600">
                → Efektívna provízia: {formatPercentage(calculations.effectiveUnregulated)}
              </p>
            </div>
          </div>

          {/* Right Column - Live Results */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Výsledky kalkulácie</h3>
            
            {/* Revenue from Transactions */}
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

            {/* Customer Payments vs Company Costs */}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeProfitCalculator;
