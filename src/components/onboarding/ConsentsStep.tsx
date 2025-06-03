
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OnboardingData } from "@/types/onboarding";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const ConsentsStep = ({ data, updateData }: ConsentsStepProps) => {
  const updateConsents = (field: string, value: any) => {
    updateData({
      consents: {
        ...data.consents,
        [field]: value
      }
    });
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Súhlasy a podpis</CardTitle>
        <CardDescription className="text-slate-600">
          Potvrdenie súhlasov a podpísanie zmluvy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="gdpr"
              checked={data.consents.gdpr}
              onCheckedChange={(checked) => updateConsents('gdpr', checked)}
            />
            <Label htmlFor="gdpr">Súhlas so spracovaním osobných údajov (GDPR) *</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={data.consents.terms}
              onCheckedChange={(checked) => updateConsents('terms', checked)}
            />
            <Label htmlFor="terms">Súhlas s obchodnými podmienkami *</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="electronicCommunication"
              checked={data.consents.electronicCommunication}
              onCheckedChange={(checked) => updateConsents('electronicCommunication', checked)}
            />
            <Label htmlFor="electronicCommunication">Súhlas s elektronickou komunikáciou</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signatureDate">Dátum podpisu</Label>
          <Input
            id="signatureDate"
            type="date"
            value={data.consents.signatureDate}
            onChange={(e) => updateConsents('signatureDate', e.target.value)}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Po dokončení registrácie bude vygenerovaná zmluva na základe zadaných údajov. 
            Zmluva bude odoslaná na váš email na elektronické podpísanie.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentsStep;
