
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";
import { Store, MapPin, Phone, CreditCard, Building, Clock, Calendar } from "lucide-react";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const updateBusinessLocation = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateData({
        businessLocation: {
          ...data.businessLocation,
          [parent]: {
            ...(data.businessLocation[parent as keyof typeof data.businessLocation] as any),
            [child]: value
          }
        }
      });
    } else {
      updateData({
        businessLocation: {
          ...data.businessLocation,
          [field]: value
        }
      });
    }
  };

  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
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
                  <Store className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Údaje o prevádzke</h3>
              </div>
              
              <p className="text-sm text-green-800">
                Informácie o mieste podnikania, kde bude platobný terminál umiestnený.
              </p>
              
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                <p className="font-medium mb-2">Dôležité informácie</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Adresa musí byť presná pre inštaláciu terminálu</li>
                  <li>IBAN slúži pre prevod peňazí z transakcií</li>
                  <li>Otváracie hodiny pre plánovanie inštalácie</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <div className="grid md:grid-cols-2 gap-6">
                <OnboardingInput
                  label="Názov obchodného miesta *"
                  value={data.businessLocation.name}
                  onChange={(e) => updateBusinessLocation('name', e.target.value)}
                  placeholder="Názov predajne/prevádzky"
                  icon={<Store className="h-4 w-4" />}
                />
                
                <div className="flex items-end h-full pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPOS"
                      checked={data.businessLocation.hasPOS}
                      onCheckedChange={(checked) => updateBusinessLocation('hasPOS', checked)}
                    />
                    <label htmlFor="hasPOS" className="text-sm text-slate-700">
                      Je na prevádzke POS?
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" /> 
                  Adresa prevádzky
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <OnboardingInput
                      label="Ulica a číslo *"
                      value={data.businessLocation.address.street}
                      onChange={(e) => updateBusinessLocation('address.street', e.target.value)}
                      placeholder="Obchodná ulica 456"
                    />
                  </div>
                  
                  <OnboardingInput
                    label="PSČ *"
                    value={data.businessLocation.address.zipCode}
                    onChange={(e) => updateBusinessLocation('address.zipCode', e.target.value)}
                    placeholder="01001"
                  />
                </div>
                
                <OnboardingInput
                  label="Mesto *"
                  value={data.businessLocation.address.city}
                  onChange={(e) => updateBusinessLocation('address.city', e.target.value)}
                  placeholder="Bratislava"
                />
              </div>

              <OnboardingInput
                label="IBAN *"
                value={data.businessLocation.iban}
                onChange={(e) => updateBusinessLocation('iban', e.target.value)}
                placeholder="SK89 1200 0000 1987 4263 7541"
                icon={<CreditCard className="h-4 w-4" />}
              />

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  Kontaktná osoba pre prevádzku
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <OnboardingInput
                    label="Meno a priezvisko *"
                    value={data.businessLocation.contactPerson.name}
                    onChange={(e) => updateBusinessLocation('contactPerson.name', e.target.value)}
                    placeholder="Mária Kováčová"
                  />
                  
                  <OnboardingInput
                    label="Email *"
                    type="email"
                    value={data.businessLocation.contactPerson.email}
                    onChange={(e) => updateBusinessLocation('contactPerson.email', e.target.value)}
                    placeholder="maria.kovacova@prevadzka.sk"
                  />
                  
                  <OnboardingInput
                    label="Telefón *"
                    value={data.businessLocation.contactPerson.phone}
                    onChange={(e) => updateBusinessLocation('contactPerson.phone', e.target.value)}
                    placeholder="+421 987 654 321"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-600" />
                  Údaje o podnikaní
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <OnboardingInput
                    label="Odbor podnikania / MCC *"
                    value={data.businessLocation.businessSector}
                    onChange={(e) => updateBusinessLocation('businessSector', e.target.value)}
                    placeholder="Maloobchod, reštaurácie, služby..."
                  />
                  
                  <OnboardingInput
                    label="Odhadovaný obrat (EUR) *"
                    type="number"
                    value={data.businessLocation.estimatedTurnover || ''}
                    onChange={(e) => updateBusinessLocation('estimatedTurnover', Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>

                <OnboardingInput
                  label="Priemerná výška transakcie (EUR) *"
                  type="number"
                  value={data.businessLocation.averageTransaction || ''}
                  onChange={(e) => updateBusinessLocation('averageTransaction', Number(e.target.value))}
                  placeholder="25"
                />
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  Prevádzkové informácie
                </h3>
                
                <OnboardingTextarea
                  label="Otváracie hodiny *"
                  value={data.businessLocation.openingHours}
                  onChange={(e) => updateBusinessLocation('openingHours', e.target.value)}
                  placeholder="Po-Pia: 9:00-18:00, So: 9:00-14:00, Ne: zatvorené"
                  rows={3}
                />

                <div className="mt-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <OnboardingSelect
                      label="Sezónnosť *"
                      value={data.businessLocation.seasonality}
                      onValueChange={(value) => updateBusinessLocation('seasonality', value)}
                      options={seasonalityOptions}
                      icon={<Calendar className="h-4 w-4" />}
                    />
                    
                    {data.businessLocation.seasonality === 'seasonal' && (
                      <OnboardingInput
                        label="Počet týždňov v sezóne"
                        type="number"
                        value={data.businessLocation.seasonalWeeks || ''}
                        onChange={(e) => updateBusinessLocation('seasonalWeeks', Number(e.target.value))}
                        placeholder="20"
                        min="1"
                        max="52"
                      />
                    )}
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

export default BusinessLocationStep;
