
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, TrendingUp } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { formatPercentage } from "../utils/currencyUtils";

interface FeesConfigurationProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

const FeesConfiguration = ({ data, updateData }: FeesConfigurationProps) => {
  const [localRegulatedRate, setLocalRegulatedRate] = useState(data.fees.regulatedCards || 0.9);
  const [localUnregulatedRate, setLocalUnregulatedRate] = useState(data.fees.unregulatedCards || 1.5);

  // Debounced update to global state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateData({
        fees: {
          ...data.fees,
          regulatedCards: localRegulatedRate,
          unregulatedCards: localUnregulatedRate
        }
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localRegulatedRate, localUnregulatedRate, data.fees, updateData]);

  const handleRegulatedRateChange = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalRegulatedRate(numValue);
  }, []);

  const handleUnregulatedRateChange = useCallback((value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalUnregulatedRate(numValue);
  }, []);

  const effectiveRegulated = Math.max(0, localRegulatedRate - 0.2);
  const effectiveUnregulated = Math.max(0, localUnregulatedRate - 0.2);

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          Nastavenie provízií
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="border-slate-300 focus:border-blue-500"
              placeholder="0.90"
            />
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              Efektívna provízia: {formatPercentage(effectiveRegulated)}
            </div>
          </div>

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
              className="border-slate-300 focus:border-blue-500"
              placeholder="1.50"
            />
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              Efektívna provízia: {formatPercentage(effectiveUnregulated)}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-2">Ako fungujú provízie?</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>MIF++ zahŕňa všetky poplatky za spracovanie transakcií</li>
            <li>Efektívna provízia je po odpočítaní našej marže 0.2%</li>
            <li>Regulované karty majú nižšie poplatky (SK, EU karty)</li>
            <li>Neregulované karty majú vyššie poplatky (mimo EU karty)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeesConfiguration;
