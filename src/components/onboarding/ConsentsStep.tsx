
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const authorizedPersonsOptions = data.authorizedPersons.map(person => ({
    value: person.id,
    label: `${person.firstName} ${person.lastName}`
  }));

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
          <div className="flex items-start space-x-3">
            <Checkbox
              id="gdpr"
              checked={data.consents.gdpr}
              onCheckedChange={(checked) => updateConsents('gdpr', checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="gdpr" className="text-sm font-medium text-slate-900">
                Súhlas so spracovaním osobných údajov (GDPR) *
              </Label>
              <p className="text-xs text-slate-600">
                Súhlasím so spracovaním osobných údajov v súlade s nariadením GDPR
                pre účely uzatvorenia a plnenia zmluvy o poskytovaní platobných služieb.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={data.consents.terms}
              onCheckedChange={(checked) => updateConsents('terms', checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="terms" className="text-sm font-medium text-slate-900">
                Súhlas s obchodnými podmienkami *
              </Label>
              <p className="text-xs text-slate-600">
                Súhlasím s obchodnými podmienkami poskytovania platobných služieb
                a s cenníkom poplatkov za poskytované služby.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="electronicCommunication"
              checked={data.consents.electronicCommunication}
              onCheckedChange={(checked) => updateConsents('electronicCommunication', checked)}
              className="mt-1"
            />
            <div className="space-y-1">
              <Label htmlFor="electronicCommunication" className="text-sm font-medium text-slate-900">
                Súhlas s elektronickou komunikáciou
              </Label>
              <p className="text-xs text-slate-600">
                Súhlasím s doručovaním dokumentov a komunikáciou v elektronickej forme
                na uvedenú emailovú adresu.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-4">
          <h3 className="font-medium text-slate-900">Údaje o podpise</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signatureDate">Dátum podpisu *</Label>
              <Input
                id="signatureDate"
                type="date"
                value={data.consents.signatureDate}
                onChange={(e) => updateConsents('signatureDate', e.target.value)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signingPerson">Podpisujúca osoba *</Label>
              <Select
                value={data.consents.signingPersonId}
                onValueChange={(value) => updateConsents('signingPersonId', value)}
              >
                <SelectTrigger className="border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Vyberte podpisujúcu osobu" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {authorizedPersonsOptions.map((person) => (
                    <SelectItem key={person.value} value={person.value}>
                      {person.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Ďalšie kroky</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>1.</strong> Po dokončení registrácie bude vygenerovaná zmluva na základe zadaných údajov.
            </p>
            <p>
              <strong>2.</strong> Zmluva bude odoslaná na váš email na elektronické podpísanie.
            </p>
            <p>
              <strong>3.</strong> Po podpísaní zmluvy bude váš účet aktivovaný a môžete začať používať služby.
            </p>
            <p>
              <strong>4.</strong> Zariadenia budú doručené na adresu prevádzky do 5 pracovných dní.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Dôležité:</strong> Všetky povinné polia musia byť vyplnené a súhlasy udelené
            pred dokončením registrácie. Skontrolujte prosím všetky údaje v predchádzajúcich krokoch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentsStep;
