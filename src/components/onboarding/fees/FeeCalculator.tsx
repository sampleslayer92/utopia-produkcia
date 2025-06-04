
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface FeeCalculatorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const FeeCalculator = ({ data, updateData }: FeeCalculatorProps) => {
  const [showResults, setShowResults] = useState(false);

  // Calculate total estimated turnover from all business locations
  const totalTurnover = data.businessLocations.reduce(
    (sum, location) => sum + (location.estimatedTurnover || 0), 
    0
  );

  // Calculate monthly device costs from selected devices
  const monthlyDeviceCosts = data.deviceSelection.dynamicCards.reduce(
    (sum, card) => sum + (card.count * card.monthlyFee), 
    0
  );

  const annualDeviceCosts = monthlyDeviceCosts * 12;

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

  const calculateFees = () => {
    const regulatedFee = totalTurnover * (effectiveRegulated / 100);
    const unregulatedFee = totalTurnover * (effectiveUnregulated / 100);
    const totalAnnualCosts = regulatedFee + unregulatedFee + annualDeviceCosts;

    const calculatorResults = {
      totalTurnover,
      monthlyDeviceCosts,
      annualDeviceCosts,
      effectiveRegulated,
      effectiveUnregulated,
      regulatedFee,
      unregulatedFee,
      totalAnnualCosts
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
          <Calculator className="h-5 w-5 text-blue-600" />
          Kalkulačka poplatkov
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-filled inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-700">Odhadovaný obrat (ročne)</Label>
            <Input
              type="text"
              value={formatCurrency(totalTurnover)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Predvyplnené z údajov prevádzkární</p>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700">Suma mesačných nákladov (zariadenia)</Label>
            <Input
              type="text"
              value={formatCurrency(monthlyDeviceCosts)}
              readOnly
              className="bg-slate-50 border-slate-300"
            />
            <p className="text-xs text-slate-500">Spočítané zo zariadení (Krok 4)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Suma ročných nákladov</Label>
          <Input
            type="text"
            value={formatCurrency(annualDeviceCosts)}
            readOnly
            className="bg-slate-50 border-slate-300"
          />
          <p className="text-xs text-slate-500">Mesačný náklad × 12</p>
        </div>

        {/* Fee inputs with effective rates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="regulatedCards">Regulované karty (%)</Label>
            <Input
              id="regulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.regulatedCards}
              onChange={(e) => updateFees('regulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
              placeholder="0.90"
            />
            <p className="text-sm text-blue-600">
              → Efektívna provízia: {formatPercentage(effectiveRegulated)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unregulatedCards">Neregulované karty (%)</Label>
            <Input
              id="unregulatedCards"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={data.fees.unregulatedCards}
              onChange={(e) => updateFees('unregulatedCards', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
              placeholder="1.50"
            />
            <p className="text-sm text-blue-600">
              → Efektívna provízia: {formatPercentage(effectiveUnregulated)}
            </p>
          </div>
        </div>

        {/* Calculate button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={calculateFees}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 px-8"
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
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    💡 Výsledok výpočtu:
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>• Odhadovaný obrat:</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.totalTurnover)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>• MIF++ poplatok (regulované): {formatPercentage(data.fees.calculatorResults.effectiveRegulated)} →</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.regulatedFee)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>• MIF++ poplatok (neregulované): {formatPercentage(data.fees.calculatorResults.effectiveUnregulated)} →</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.unregulatedFee)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>• Mesačné náklady na zariadenia:</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.monthlyDeviceCosts)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>• Ročné náklady na zariadenia:</span>
                      <span className="font-medium">{formatCurrency(data.fees.calculatorResults.annualDeviceCosts)}</span>
                    </div>
                    
                    <div className="border-t border-slate-300 pt-3 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-900">📊 Celkové predpokladané náklady ročne:</span>
                        <span className="font-bold text-lg text-blue-600">{formatCurrency(data.fees.calculatorResults.totalAnnualCosts)}</span>
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

export default FeeCalculator;
