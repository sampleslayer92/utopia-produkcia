
import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Euro, Target } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { formatCurrency, formatCurrencyWithColor, formatPercentage } from "../utils/currencyUtils";

interface RealTimeProfitCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const RealTimeProfitCalculator = ({ data, updateData }: RealTimeProfitCalculatorProps) => {
  // Calculate monthly turnover from all business locations
  const monthlyTurnover = useMemo(() => {
    return data.businessLocations.reduce(
      (sum, location) => sum + (location.estimatedTurnover || 0), 
      0
    );
  }, [data.businessLocations]);

  // Calculate total customer payments and company costs
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

  // Real-time calculation results
  const calculationResults = useMemo(() => {
    const effectiveRegulated = Math.max(0, data.fees.regulatedCards - 0.2);
    const effectiveUnregulated = Math.max(0, data.fees.unregulatedCards - 0.2);
    
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
  }, [
    monthlyTurnover,
    totalCustomerPayments,
    totalCompanyCosts,
    data.fees.regulatedCards,
    data.fees.unregulatedCards
  ]);

  // Auto-save calculation results
  const updateCalculationResults = useCallback(() => {
    updateData({
      fees: {
        ...data.fees,
        calculatorResults: {
          ...calculationResults,
          customerPaymentBreakdown: [],
          companyCostBreakdown: []
        }
      }
    });
  }, [calculationResults, data.fees, updateData]);

  // Update results whenever calculation changes
  useMemo(() => {
    const timeoutId = setTimeout(updateCalculationResults, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [updateCalculationResults]);

  const updateFees = useCallback((field: keyof typeof data.fees, value: number) => {
    updateData({
      fees: {
        ...data.fees,
        [field]: value
      }
    });
  }, [data.fees, updateData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Inputs */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Vstupné údaje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monthly Turnover */}
          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">
              Odhadovaný mesačný obrat (EUR)
            </Label>
            <Input
              type="text"
              value={formatCurrency(monthlyTurnover)}
              readOnly
              className="bg-slate-50 border-slate-300 text-lg font-semibold"
            />
            <p className="text-xs text-slate-500">
              Automaticky spočítané z prevádzkární
            </p>
          </div>

          {/* Regulated Cards Fee */}
          <div className="space-y-2">
            <Label htmlFor="regulatedCards" className="text-slate-700 font-medium">
              MIF++ regulované karty (%)
            </Label>
            <Input
              id="regulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.regulatedCards}
              onChange={(e) => updateFees('regulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500 text-lg"
              placeholder="0.90"
            />
            <p className="text-sm text-blue-600">
              → Efektívna provízia: {formatPercentage(calculationResults.effectiveRegulated)}
            </p>
          </div>

          {/* Unregulated Cards Fee */}
          <div className="space-y-2">
            <Label htmlFor="unregulatedCards" className="text-slate-700 font-medium">
              MIF++ neregulované karty (%)
            </Label>
            <Input
              id="unregulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.unregulatedCards}
              onChange={(e) => updateFees('unregulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500 text-lg"
              placeholder="1.50"
            />
            <p className="text-sm text-blue-600">
              → Efektívna provízia: {formatPercentage(calculationResults.effectiveUnregulated)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - Results */}
      <Card className="border-green-200/60 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Výsledky kalkulácie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Revenue */}
          <div className="bg-white/60 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Euro className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold text-slate-900">Výnos od klienta</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tržba z transakcií:</span>
                <span className={`font-medium ${formatCurrencyWithColor(calculationResults.transactionMargin).className || 'text-green-600'}`}>
                  {formatCurrencyWithColor(calculationResults.transactionMargin).value}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platby za služby:</span>
                <span className={`font-medium ${formatCurrencyWithColor(calculationResults.totalCustomerPayments).className || 'text-green-600'}`}>
                  {formatCurrencyWithColor(calculationResults.totalCustomerPayments).value}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Celkový výnos:</span>
                <span className={`font-bold text-lg ${formatCurrencyWithColor(calculationResults.transactionMargin + calculationResults.totalCustomerPayments).className || 'text-green-600'}`}>
                  {formatCurrencyWithColor(calculationResults.transactionMargin + calculationResults.totalCustomerPayments).value}
                </span>
              </div>
            </div>
          </div>

          {/* Company Costs */}
          <div className="bg-white/60 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Náklady</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Firemné náklady na služby:</span>
                <span className={`font-medium ${formatCurrencyWithColor(-calculationResults.totalCompanyCosts).className || 'text-red-600'}`}>
                  {formatCurrency(calculationResults.totalCompanyCosts)}
                </span>
              </div>
            </div>
          </div>

          {/* Final Profit */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6 border-2 border-green-300">
            <div className="text-center">
              <h3 className="font-bold text-slate-900 mb-2">Váš mesačný zisk</h3>
              <Badge 
                variant="outline" 
                className={`text-2xl font-bold px-4 py-2 ${
                  calculationResults.totalMonthlyProfit >= 0 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-red-600 text-white border-red-600'
                }`}
              >
                {formatCurrency(calculationResults.totalMonthlyProfit)}
              </Badge>
              <div className="text-xs text-slate-600 mt-2">
                {calculationResults.totalMonthlyProfit >= 0 ? '✅ Ziskový' : '❌ Stratový'} projekt
              </div>
            </div>
          </div>

          {/* Breakdown Summary */}
          <div className="bg-white/40 rounded-lg p-4 border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Rozpis marže:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>• Marža z transakcií:</span>
                <span className={`font-medium ${formatCurrencyWithColor(calculationResults.transactionMargin).className || 'text-green-600'}`}>
                  {formatCurrencyWithColor(calculationResults.transactionMargin).value}
                </span>
              </div>
              <div className="flex justify-between">
                <span>• Marža zo služieb:</span>
                <span className={`font-medium ${formatCurrencyWithColor(calculationResults.serviceMargin).className || (calculationResults.serviceMargin >= 0 ? 'text-green-600' : 'text-red-600')}`}>
                  {formatCurrencyWithColor(calculationResults.serviceMargin).value}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeProfitCalculator;
