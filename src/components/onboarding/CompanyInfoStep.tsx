
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingSection from "./ui/OnboardingSection";
import ORSRSearch from "./ui/ORSRSearch";
import { Building2, MapPin, User } from "lucide-react";

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  const updateCompanyInfo = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [parent]: {
            ...(data.companyInfo[parent as keyof typeof data.companyInfo] as any),
            [child]: value
          }
        }
      });
    } else {
      updateData({
        companyInfo: {
          ...data.companyInfo,
          [field]: value
        }
      });
    }
  };

  const handleORSRData = (orsrData: any) => {
    updateData({
      companyInfo: {
        ...data.companyInfo,
        companyName: orsrData.companyName,
        dic: orsrData.dic,
        court: orsrData.court,
        section: orsrData.section,
        insertNumber: orsrData.insertNumber,
        address: orsrData.address
      }
    });
  };

  const registryTypeOptions = [
    { value: "public", label: "Verejný register" },
    { value: "business", label: "Živnostenský register" },
    { value: "other", label: "Iný" }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar with info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Údaje o spoločnosti</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Zadajte základné informácie o vašej spoločnosti pre správne vedenie zmluvy a platobných služieb.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Prečo potrebujeme tieto údaje?</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Pre vystavenie faktúr</li>
                  <li>Pre právne dokumenty a zmluvy</li>
                  <li>Pre zriadenie platobného terminálu</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <OnboardingInput
                    label="IČO *"
                    value={data.companyInfo.ico}
                    onChange={(e) => updateCompanyInfo('ico', e.target.value)}
                    placeholder="12345678"
                    icon={<Building2 className="h-4 w-4" />}
                  />
                  <ORSRSearch
                    ico={data.companyInfo.ico}
                    onDataFound={handleORSRData}
                  />
                </div>
                
                <OnboardingInput
                  label="DIČ *"
                  value={data.companyInfo.dic}
                  onChange={(e) => updateCompanyInfo('dic', e.target.value)}
                  placeholder="SK2012345678"
                />
              </div>

              <OnboardingInput
                label="Obchodné meno spoločnosti *"
                value={data.companyInfo.companyName}
                onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
                placeholder="Zadajte obchodné meno"
              />

              <OnboardingSelect
                label="Zápis v obchodnom registri *"
                value={data.companyInfo.registryType}
                onValueChange={(value) => updateCompanyInfo('registryType', value)}
                options={registryTypeOptions}
                placeholder="Vyberte typ registra"
              />

              <div className="grid md:grid-cols-3 gap-6">
                <OnboardingInput
                  label="Súd"
                  value={data.companyInfo.court}
                  onChange={(e) => updateCompanyInfo('court', e.target.value)}
                  placeholder="Okresný súd"
                />
                
                <OnboardingInput
                  label="Oddiel"
                  value={data.companyInfo.section}
                  onChange={(e) => updateCompanyInfo('section', e.target.value)}
                  placeholder="Sro"
                />
                
                <OnboardingInput
                  label="Vložka"
                  value={data.companyInfo.insertNumber}
                  onChange={(e) => updateCompanyInfo('insertNumber', e.target.value)}
                  placeholder="12345/B"
                />
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" /> 
                  Sídlo spoločnosti
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <OnboardingInput
                      label="Ulica a číslo *"
                      value={data.companyInfo.address.street}
                      onChange={(e) => updateCompanyInfo('address.street', e.target.value)}
                      placeholder="Hlavná ulica 123"
                    />
                  </div>
                  
                  <OnboardingInput
                    label="PSČ *"
                    value={data.companyInfo.address.zipCode}
                    onChange={(e) => updateCompanyInfo('address.zipCode', e.target.value)}
                    placeholder="01001"
                  />
                </div>
                
                <OnboardingInput
                  label="Mesto *"
                  value={data.companyInfo.address.city}
                  onChange={(e) => updateCompanyInfo('address.city', e.target.value)}
                  placeholder="Bratislava"
                />
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Kontaktná adresa spoločnosti
                </h3>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="contactAddressSameAsMain"
                    checked={data.companyInfo.contactAddressSameAsMain}
                    onCheckedChange={(checked) => updateCompanyInfo('contactAddressSameAsMain', checked)}
                  />
                  <label htmlFor="contactAddressSameAsMain" className="text-sm text-slate-700">
                    Kontaktná adresa sa zhoduje so sídlom spoločnosti
                  </label>
                </div>

                {!data.companyInfo.contactAddressSameAsMain && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <OnboardingInput
                          label="Ulica a číslo *"
                          value={data.companyInfo.contactAddress?.street || ''}
                          onChange={(e) => updateCompanyInfo('contactAddress.street', e.target.value)}
                          placeholder="Kontaktná ulica 456"
                        />
                      </div>
                      
                      <OnboardingInput
                        label="PSČ *"
                        value={data.companyInfo.contactAddress?.zipCode || ''}
                        onChange={(e) => updateCompanyInfo('contactAddress.zipCode', e.target.value)}
                        placeholder="01001"
                      />
                    </div>
                    
                    <OnboardingInput
                      label="Mesto *"
                      value={data.companyInfo.contactAddress?.city || ''}
                      onChange={(e) => updateCompanyInfo('contactAddress.city', e.target.value)}
                      placeholder="Bratislava"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 mt-4">
                <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Kontaktná osoba
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <OnboardingInput
                    label="Meno a priezvisko *"
                    value={data.companyInfo.contactPerson.name}
                    onChange={(e) => updateCompanyInfo('contactPerson.name', e.target.value)}
                    placeholder="Ján Novák"
                  />
                  
                  <OnboardingInput
                    label="Email *"
                    type="email"
                    value={data.companyInfo.contactPerson.email}
                    onChange={(e) => updateCompanyInfo('contactPerson.email', e.target.value)}
                    placeholder="jan.novak@firma.sk"
                  />
                  
                  <OnboardingInput
                    label="Telefón *"
                    value={data.companyInfo.contactPerson.phone}
                    onChange={(e) => updateCompanyInfo('contactPerson.phone', e.target.value)}
                    placeholder="+421 123 456 789"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="isTechnicalPerson"
                    checked={data.companyInfo.contactPerson.isTechnicalPerson}
                    onCheckedChange={(checked) => updateCompanyInfo('contactPerson.isTechnicalPerson', checked)}
                  />
                  <label htmlFor="isTechnicalPerson" className="text-sm text-slate-700">
                    Je zároveň technická osoba
                  </label>
                </div>
              </div>
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
