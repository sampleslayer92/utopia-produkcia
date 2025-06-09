
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { OnboardingData } from "@/types/onboarding";
import { AlertCircle, FileDigit, FileCheck, FileWarning } from "lucide-react";
import { useEffect } from "react";
import { format } from "date-fns";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingSection from "./ui/OnboardingSection";
import SignaturePad from "./ui/SignaturePad";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature?: () => void;
}

const ConsentsStep = ({ data, updateData, onSaveSignature }: ConsentsStepProps) => {
  // Automatically set today's date if signature date is empty
  useEffect(() => {
    if (!data.consents.signatureDate) {
      const today = format(new Date(), 'yyyy-MM-dd');
      updateConsents('signatureDate', today);
    }
  }, []);

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

  const allRequiredConsentsProvided = data.consents.gdpr && 
                                     data.consents.terms && 
                                     data.consents.signatureDate && 
                                     data.consents.signingPersonId &&
                                     data.consents.signatureUrl;

  const handleSignatureChange = (url: string) => {
    updateConsents('signatureUrl', url);
    // Automatically call onSaveSignature when signature is created
    if (url && onSaveSignature) {
      onSaveSignature();
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileDigit className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Súhlasy a podpis</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Finálny krok onboardingu - potvrdenie súhlasov a elektronický podpis zmluvy.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Čo obsahuje tento krok</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Súhlasy s podmienkami a GDPR</li>
                  <li>Elektronický podpis</li>
                  <li>Finálne dokončenie registrácie</li>
                </ul>
              </div>
              
              <div className={`mt-4 rounded-lg p-4 ${
                allRequiredConsentsProvided 
                  ? 'bg-green-100/50 border border-green-200 text-green-800' 
                  : 'bg-amber-100/50 border border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-3">
                  {allRequiredConsentsProvided ? (
                    <FileCheck className="h-5 w-5 mt-0.5" />
                  ) : (
                    <FileWarning className="h-5 w-5 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-xs">
                      {allRequiredConsentsProvided 
                        ? 'Všetko je pripravené na dokončenie' 
                        : 'Dokončite povinné kroky'
                      }
                    </p>
                    <p className="text-xs mt-1">
                      {allRequiredConsentsProvided 
                        ? 'Registráciu môžete dokončiť' 
                        : 'Udeľte súhlasy a podpíšte zmluvu'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <div className="space-y-6">
                {/* Consents section - keep existing code */}
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
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
                        <div className="text-sm text-slate-600">
                          <p>
                            Súhlasím so spracovaním osobných údajov v súlade s nariadením GDPR
                            pre účely uzatvorenia a plnenia zmluvy o poskytovaní platobných služieb.
                          </p>
                          <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                            Zobraziť úplné znenie súhlasu
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
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
                        <div className="text-sm text-slate-600">
                          <p>
                            Súhlasím s obchodnými podmienkami poskytovania platobných služieb
                            a s cenníkom poplatkov za poskytované služby.
                          </p>
                          <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                            Zobraziť obchodné podmienky
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
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
                        <div className="text-sm text-slate-600">
                          <p>
                            Súhlasím s doručovaním dokumentov a komunikáciou v elektronickej forme
                            na uvedenú emailovú adresu.
                          </p>
                          <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                            Zobraziť možnosti komunikácie
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature information */}
                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="font-medium text-slate-900 flex items-center gap-2">
                    <FileDigit className="h-4 w-4 text-blue-500" />
                    Údaje o podpise
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <OnboardingInput
                      label="Dátum podpisu *"
                      type="date"
                      value={data.consents.signatureDate}
                      onChange={(e) => updateConsents('signatureDate', e.target.value)}
                      error={!data.consents.signatureDate ? "Dátum podpisu je povinný údaj" : undefined}
                    />

                    <OnboardingSelect
                      label="Podpisujúca osoba *"
                      value={data.consents.signingPersonId}
                      onValueChange={(value) => updateConsents('signingPersonId', value)}
                      options={authorizedPersonsOptions}
                      placeholder="Vyberte podpisujúcu osobu"
                      error={!data.consents.signingPersonId ? "Podpisujúca osoba je povinný údaj" : undefined}
                    />
                  </div>
                </div>

                {/* Electronic Signature */}
                <div className="border-t border-slate-200 pt-6">
                  <SignaturePad
                    value={data.consents.signatureUrl}
                    onSignatureChange={handleSignatureChange}
                    disabled={!data.consents.signingPersonId}
                  />
                  
                  {!data.consents.signingPersonId && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">
                        Najprv vyberte podpisujúcu osobu, potom môžete vytvoriť elektronický podpis.
                      </p>
                    </div>
                  )}
                </div>

                {/* Next steps info - keep existing code */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Ďalšie kroky</h4>
                      <ol className="space-y-3 text-sm text-blue-800">
                        <li className="flex items-baseline gap-2">
                          <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 font-medium">1</span>
                          <span>Po dokončení registrácie bude vygenerovaná zmluva na základe zadaných údajov.</span>
                        </li>
                        <li className="flex items-baseline gap-2">
                          <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 font-medium">2</span>
                          <span>Zmluva bude odoslaná na váš email na elektronické podpísanie.</span>
                        </li>
                        <li className="flex items-baseline gap-2">
                          <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 font-medium">3</span>
                          <span>Po podpísaní zmluvy bude váš účet aktivovaný a môžete začať používať služby.</span>
                        </li>
                        <li className="flex items-baseline gap-2">
                          <span className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 font-medium">4</span>
                          <span>Zariadenia budú doručené na adresu prevádzky do 5 pracovných dní.</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Dôležité:</span> Všetky povinné polia musia byť vyplnené, súhlasy udelené
                      a elektronický podpis vytvorený pred dokončením registrácie.
                    </p>
                  </div>
                </div>
              </div>
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentsStep;
