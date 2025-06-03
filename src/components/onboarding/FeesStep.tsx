
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/types/onboarding";

interface FeesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const FeesStep = ({ data, updateData }: FeesStepProps) => {
  const updateFees = (field: keyof typeof data.fees, value: number) => {
    updateData({
      fees: {
        ...data.fees,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Poplatky</CardTitle>
          <CardDescription className="text-slate-600">
            Nastavenie poplatkov za spracovanie kariet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
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
                placeholder="0.90"
              />
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3">Výpočet provízie</h3>
            <p className="text-sm text-slate-700 mb-3">
              Vaša celková výška provízie bude spočítaná ako suma nasledujúcich 3 položiek:
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <strong>• Interchange Fee (Medzibankový poplatok)</strong> – publikovaný príslušnou kartovou asociáciou – Visa, Mastercard, Diners, JCB a UnionPay
              </li>
              <li>
                <strong>• Scheme and Processing Fees (Poplatky schém)</strong> – stanovené v tabuľke poplatkov, ktorú nájdete vo vyplnenej žiadosti
              </li>
              <li>
                <strong>• Acquirer fee (Poplatok účtovaný poskytovateľom)</strong> sú definované takto:
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeesStep;
