
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import FeesConfiguration from "./fees/FeesConfiguration";
import ProfitSummary from "./fees/ProfitSummary";
import { Calculator } from "lucide-react";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeesStep = ({ data, updateData }: FeesStepProps) => {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Kalkulácia zisku</h3>
              </div>
              
              <p className="text-sm text-green-800">
                Nastavte si provízie za spracovanie platieb a sledujte predpokladaný mesačný zisk v reálnom čase.
              </p>
              
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                <p className="font-medium mb-2">Výpočet zahŕňa</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Tržby z transakčných poplatkov</li>
                  <li>Marže z predajov zariadení a služieb</li>
                  <li>Údaje o obrate z vašich prevádzok</li>
                  <li>Nastaviteľné sadzby pre rôzne typy kariet</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 lg:col-span-2 p-6 lg:p-8">
            <div className="space-y-8">
              <FeesConfiguration data={data} updateData={updateData} />
              <ProfitSummary data={data} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeesStep;
