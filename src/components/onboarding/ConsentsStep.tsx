
import { OnboardingData } from "@/types/onboarding";
import { useState } from "react";
import { Check, FileText, Lock, Mail, Shield, PenTool } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import OnboardingSection from "./ui/OnboardingSection";
import ContractPreviewModal from "./components/ContractPreviewModal";
import { toast } from "sonner";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const ConsentsStep = ({ data, updateData, onPrev, onComplete }: ConsentsStepProps) => {
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const updateConsents = (field: string, value: boolean | string) => {
    updateData({
      consents: {
        ...data.consents,
        [field]: value
      }
    });
  };

  const areAllConsentsGiven = () => {
    return data.consents.gdpr && 
           data.consents.terms && 
           data.consents.electronicCommunication;
  };

  const handleSignContract = async () => {
    if (!areAllConsentsGiven()) {
      toast.error("Musíte súhlasiť so všetkými podmienkami pred podpisom zmluvy.");
      return;
    }

    if (!data.contractId) {
      toast.error("Chyba: ID zmluvy nebolo nájdené. Skúste obnoviť stránku.");
      return;
    }

    setIsSigning(true);
    
    try {
      // Simulate signing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const signatureDate = new Date().toISOString();
      const signingPerson = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`;
      
      updateData({
        consents: {
          ...data.consents,
          isSigned: true,
          signedAt: signatureDate,
          signedBy: signingPerson,
          signatureDate: signatureDate,
          signingPersonId: data.contactInfo.userRole
        }
      });

      setShowContractPreview(false);
      
      toast.success("Zmluva bola úspešne podpísaná!", {
        description: "Teraz sa dokončí vytvorenie vašeho účtu."
      });
      
      // Complete the onboarding process after a short delay
      setTimeout(() => {
        onComplete();
      }, 1500);
      
    } catch (error) {
      console.error('Chyba pri podpisovaní zmluvy:', error);
      toast.error("Nastala chyba pri podpisovaní zmluvy", {
        description: "Skúste to znovu. Ak problém pretrváva, kontaktujte podporu."
      });
    } finally {
      setIsSigning(false);
    }
  };

  const consentItems = [
    {
      id: 'gdpr',
      label: 'Súhlas so spracovaním osobných údajov (GDPR)',
      description: 'Súhlasím so spracovaním mojich osobných údajov v súlade s GDPR.',
      checked: data.consents.gdpr,
      icon: Shield,
      required: true
    },
    {
      id: 'terms',
      label: 'Súhlas s obchodnými podmienkami',
      description: 'Súhlasím s všeobecnými obchodnými podmienkami spoločnosti.',
      checked: data.consents.terms,
      icon: FileText,
      required: true
    },
    {
      id: 'electronicCommunication',
      label: 'Súhlas s elektronickým doručovaním',
      description: 'Súhlasím s doručovaním dokumentov a komunikácie elektronickou formou.',
      checked: data.consents.electronicCommunication,
      icon: Mail,
      required: true
    }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Súhlasy a podpis</h3>
              </div>
              
              <p className="text-sm text-green-800">
                Posledný krok! Prečítajte si podmienky a podpíšte zmluvu.
              </p>
              
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                <p className="font-medium mb-2">Čo sa stane po podpise:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Vytvorí sa váš klientský záznam</li>
                  <li>Zmluva nadobudne platnosť</li>
                  <li>Začne sa proces aktivácie služieb</li>
                  <li>Dostanete potvrdenie na email</li>
                </ul>
              </div>

              {data.consents.isSigned && (
                <div className="bg-emerald-100/50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-800">
                  <p className="font-medium flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Zmluva podpísaná
                  </p>
                  <p>Podpísal: {data.consents.signedBy}</p>
                  <p>Dátum: {data.consents.signedAt ? new Date(data.consents.signedAt).toLocaleDateString('sk-SK') : 'N/A'}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <div className="space-y-6">
                {/* Consent checkboxes */}
                <div className="space-y-4">
                  {consentItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) => updateConsents(item.id, !!checked)}
                        className="mt-1"
                        disabled={data.consents.isSigned}
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={item.id}
                          className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                          {item.required && <span className="text-red-500">*</span>}
                        </label>
                        <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contract preview and signature section */}
                <div className="border-t pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900">Podpis zmluvy</h3>
                    
                    {!data.consents.isSigned ? (
                      <>
                        <p className="text-sm text-slate-600">
                          Pred podpisom si môžete prezrieť celú zmluvu.
                        </p>
                        
                        <div className="flex justify-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowContractPreview(true)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Zobraziť zmluvu
                          </Button>
                          
                          <Button
                            onClick={handleSignContract}
                            disabled={!areAllConsentsGiven() || isSigning}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          >
                            <PenTool className="h-4 w-4" />
                            {isSigning ? 'Podpisujem...' : 'Podpísať zmluvu'}
                          </Button>
                        </div>
                        
                        {!areAllConsentsGiven() && (
                          <p className="text-sm text-amber-600">
                            Pre podpis zmluvy musíte súhlasiť so všetkými podmienkami
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                        <div className="flex items-center justify-center gap-3 text-emerald-700">
                          <Check className="h-6 w-6" />
                          <span className="font-semibold">Zmluva úspešne podpísaná!</span>
                        </div>
                        <p className="text-sm text-emerald-600 mt-2">
                          Vaša registrácia je dokončená. Budete presmerovaný do klientského portálu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
      
      {/* Navigation */}
      <div className="flex justify-between items-center p-6 bg-slate-50 border-t">
        <Button variant="outline" onClick={onPrev} disabled={isSigning}>
          Späť
        </Button>
        
        {data.consents.isSigned && (
          <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
            Dokončiť registráciu
          </Button>
        )}
      </div>

      {/* Contract Preview Modal */}
      <ContractPreviewModal
        isOpen={showContractPreview}
        onClose={() => setShowContractPreview(false)}
        onSign={handleSignContract}
        data={data}
        isLoading={isSigning}
      />
    </Card>
  );
};

export default ConsentsStep;
