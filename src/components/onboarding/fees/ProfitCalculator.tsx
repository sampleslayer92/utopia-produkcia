
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface ProfitCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const ProfitCalculator = ({ data, updateData }: ProfitCalculatorProps) => {
  const [showResults, setShowResults] = useState(false);

  // Calculate monthly turnover from all business locations
  const monthlyTurnover = data.businessLocations.reduce(
    (sum, location) => sum + (location.estimatedTurnover || 0), 
    0
  );

  // Calculate total customer payments (monthly fees)
  const totalCustomerPayments = data.deviceSelection.dynamicCards.reduce(
    (sum, card) => sum + (card.count * card.monthlyFee), 
    0
  );

  // Calculate total company costs
  const totalCompanyCosts = data.deviceSelection.dynamicCards.reduce(
    (sum, card) => sum + (card.count * card.companyCost), 
    0
  );

  // Calculate effective rates (subtract 0.2%)
  const effectiveRegulated = Math.max(0, data.fees.regulatedCards - 0.2);
  const effectiveUnregulated = Math.max(0, data.fees.unregulatedCards - 0.2);

  // Format number with space separators and € symbol
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('€', '').trim() + ' €';
  };

  const formatPercentage = (percent: number): string => {
    return percent.toFixed(2) + ' %';
  };

  const calculateProfit = () => {
    const regulatedFee = monthlyTurnover * (effectiveRegulated / 100);
    const unregulatedFee = monthlyTurnover * (effectiveUnregulated / 100);
    const transactionMargin = regulatedFee + unregulatedFee;
    const serviceMargin = totalCustomerPayments - totalCompanyCosts;
    const totalMonthlyProfit = transactionMargin + serviceMargin;

    const calculatorResults = {
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

    updateData({
      fees: {
        ...data.fees,
        calculatorResults
      }
    });

    setShowResults(true);
  };

  const updateFees = (field: keyof typeof data.fees, value: number) => {
    updateData({
      fees: {
        ...data.fees,
        [field]: value
      }
    });
    // Hide results when fees change
    setShowResults(false);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          Kalkulačka výnosov a nákladov
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-filled inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700">Odhadovaný mesačný obrat (EUR)</Label>
            <Input
              type="text"
              value={formatCurrency(monthlyTurnover)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Predvyplnené z údajov prevádzkární</p>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Súčet mesačných poplatkov od klienta</Label>
            <Input
              type="text"
              value={formatCurrency(totalCustomerPayments)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Spočítané zo zariadení a služieb</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Súčet mesačných nákladov pre firmu</Label>
          <Input
            type="text"
            value={formatCurrency(totalCompanyCosts)}
            readOnly
            className="bg-slate-50 border-slate-300"
          />
          <p className="text-xs text-slate-500">Reálne náklady na poskytovanie služieb</p>
        </div>

        {/* Fee inputs with effective rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="regulatedCards">MIF++ regulované karty (%)</Label>
            <Input
              id="regulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.regulatedCards}
              onChange={(e) => updateFees('regulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-green-500"
              placeholder="0.90"
            />
            <p className="text-sm text-green-600">
              → Efektívna provízia: {formatPercentage(effectiveRegulated)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unregulatedCards">MIF++ neregulované karty (%)</Label>
            <Input
              id="unregulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.unregulatedCards}
              onChange={(e) => updateFees('unregulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-green-500"
              placeholder="1.50"
            />
            <p className="text-sm text-green-600">
              → Efektívna provízia: {formatPercentage(effectiveUnregulated)}
            </p>
          </div>
        </div>

        {/* Calculate button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={calculateProfit}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white flex items-center gap-2 px-8"
          >
            <TrendingUp className="h-4 w-4" />
            Vypočítať
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {showResults && data.fees.calculatorResults && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Card className="bg-slate-50 border-slate-200 shadow-md">
                <CardContent className="pt-6">
                  {/* Transaction Revenue */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      💰 Tržba z transakcií:
                    </h3>
                    <div className="space-y-2 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>• Odhadovaný obrat:</span>
                        <span className="font-medium">{formatCurrency(data.fees.calculatorResults.monthlyTurnover)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Regulované karty: {formatPercentage(data.fees.calculatorResults.effectiveRegulated)} →</span>
                        <span className="font-medium">{formatCurrency(data.fees.calculatorResults.regulatedFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Neregulované karty: {formatPercentage(data.fees.calculatorResults.effectiveUnregulated)} →</span>
                        <span className="font-medium">{formatCurrency(data.fees.calculatorResults.unregulatedFee)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Payments */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      💼 Mesačné platby od zákazníka:
                    </h3>
                    <div className="space-y-2 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>• Súčet mesačných poplatkov:</span>
                        <span className="font-medium">{formatCurrency(data.fees.calculatorResults.totalCustomerPayments)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Company Costs */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      🔧 Vaše firemné náklady:
                    </h3>
                    <div className="space-y-2 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>• Súčet mesačných nákladov:</span>
                        <span className="font-medium text-red-600">{formatCurrency(data.fees.calculatorResults.totalCompanyCosts)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Profit */}
                  <div className="border-t border-slate-300 pt-4">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      📈 Váš mesačný zisk:
                    </h3>
                    <div className="space-y-3 text-sm ml-4">
                      <div className="flex justify-between">
                        <span>• Marža z transakcií:</span>
                        <span className="font-medium text-green-600">{formatCurrency(data.fees.calculatorResults.transactionMargin)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Marža zo služieb:</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(data.fees.calculatorResults.serviceMargin)} 
                          <span className="text-xs text-slate-500 ml-1">
                            ({formatCurrency(data.fees.calculatorResults.totalCustomerPayments)} - {formatCurrency(data.fees.calculatorResults.totalCompanyCosts)})
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <span className="font-bold text-slate-900">• Celkový mesačný zisk:</span>
                        <span className="font-bold text-xl text-green-600">{formatCurrency(data.fees.calculatorResults.totalMonthlyProfit)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
