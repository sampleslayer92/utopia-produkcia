
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin } from "lucide-react";
import EditableSection from "./EditableSection";

interface EnhancedClientOperationsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onUpdate: (path: string, value: any) => void;
  onSectionUpdate: (data: any) => void;
}

const EnhancedClientOperationsSection = ({ 
  onboardingData, 
  isEditMode, 
  onUpdate,
  onSectionUpdate 
}: EnhancedClientOperationsSectionProps) => {
  const companyInfo = onboardingData.companyInfo || {};
  const contactInfo = onboardingData.contactInfo || {};
  const businessLocations = onboardingData.businessLocations || [];

  console.log('EnhancedClientOperationsSection render:', { companyInfo, contactInfo, isEditMode });

  const handleCompanyFieldChange = (field: string, value: string) => {
    console.log(`Updating company field ${field} with value:`, value);
    onUpdate(`companyInfo.${field}`, value);
  };

  const handleContactFieldChange = (field: string, value: string) => {
    console.log(`Updating contact field ${field} with value:`, value);
    onUpdate(`contactInfo.${field}`, value);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Company Information */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            Informácie o spoločnosti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EditableSection isEditMode={isEditMode} label="Základné údaje">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-600">Názov spoločnosti</Label>
                {isEditMode ? (
                  <Input 
                    value={companyInfo.companyName || ''} 
                    onChange={(e) => handleCompanyFieldChange('companyName', e.target.value)}
                    className="mt-1"
                    placeholder="Názov spoločnosti"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{companyInfo.companyName || 'Neuvedené'}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-600">IČO</Label>
                {isEditMode ? (
                  <Input 
                    value={companyInfo.ico || ''} 
                    onChange={(e) => handleCompanyFieldChange('ico', e.target.value)}
                    className="mt-1"
                    placeholder="IČO"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{companyInfo.ico || 'Neuvedené'}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-600">DIČ</Label>
                {isEditMode ? (
                  <Input 
                    value={companyInfo.dic || ''} 
                    onChange={(e) => handleCompanyFieldChange('dic', e.target.value)}
                    className="mt-1"
                    placeholder="DIČ"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{companyInfo.dic || 'Neuvedené'}</p>
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-slate-600">IČ DPH</Label>
                {isEditMode ? (
                  <Input 
                    value={companyInfo.vatNumber || ''} 
                    onChange={(e) => handleCompanyFieldChange('vatNumber', e.target.value)}
                    className="mt-1"
                    placeholder="IČ DPH"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">{companyInfo.vatNumber || 'Nie je platca DPH'}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-600">Adresa sídla</Label>
              {isEditMode ? (
                <div className="space-y-2 mt-1">
                  <Input 
                    value={companyInfo.address?.street || ''} 
                    onChange={(e) => onUpdate('companyInfo.address.street', e.target.value)}
                    placeholder="Ulica a číslo"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={companyInfo.address?.city || ''} 
                      onChange={(e) => onUpdate('companyInfo.address.city', e.target.value)}
                      placeholder="Mesto"
                    />
                    <Input 
                      value={companyInfo.address?.zipCode || ''} 
                      onChange={(e) => onUpdate('companyInfo.address.zipCode', e.target.value)}
                      placeholder="PSČ"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-slate-900 mt-1">
                  {companyInfo.address?.street}, {companyInfo.address?.city} {companyInfo.address?.zipCode}
                </p>
              )}
            </div>
          </EditableSection>

          <div className="pt-4 border-t border-slate-200">
            <EditableSection isEditMode={isEditMode} label="Kontaktná osoba">
              <h4 className="font-medium text-slate-900 mb-3">Kontaktná osoba</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Meno</Label>
                    {isEditMode ? (
                      <Input 
                        value={contactInfo.firstName || ''} 
                        onChange={(e) => handleContactFieldChange('firstName', e.target.value)}
                        className="mt-1"
                        placeholder="Meno"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.firstName || 'Neuvedené'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Priezvisko</Label>
                    {isEditMode ? (
                      <Input 
                        value={contactInfo.lastName || ''} 
                        onChange={(e) => handleContactFieldChange('lastName', e.target.value)}
                        className="mt-1"
                        placeholder="Priezvisko"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.lastName || 'Neuvedené'}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Email</Label>
                    {isEditMode ? (
                      <Input 
                        value={contactInfo.email || ''} 
                        onChange={(e) => handleContactFieldChange('email', e.target.value)}
                        type="email"
                        className="mt-1"
                        placeholder="email@example.com"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.email || 'Neuvedené'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Telefón</Label>
                    {isEditMode ? (
                      <div className="flex mt-1">
                        <Input 
                          value={contactInfo.phonePrefix || '+421'} 
                          onChange={(e) => handleContactFieldChange('phonePrefix', e.target.value)}
                          className="w-20 mr-2"
                          placeholder="+421"
                        />
                        <Input 
                          value={contactInfo.phone || ''} 
                          onChange={(e) => handleContactFieldChange('phone', e.target.value)}
                          className="flex-1"
                          placeholder="Telefónne číslo"
                        />
                      </div>
                    ) : (
                      <p className="text-slate-900 mt-1">
                        {contactInfo.phonePrefix} {contactInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </EditableSection>
          </div>
        </CardContent>
      </Card>

      {/* Business Locations */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
              Prevádzky
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {businessLocations && businessLocations.length > 0 ? (
            businessLocations.map((location: any, index: number) => (
              <EditableSection key={location.id || index} isEditMode={isEditMode} label={`Prevádzka ${index + 1}`}>
                <div className="p-4 bg-slate-50/50 rounded-lg space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Názov prevádzky</Label>
                    {isEditMode ? (
                      <Input 
                        value={location.name || ''} 
                        onChange={(e) => onUpdate(`businessLocations.${index}.name`, e.target.value)}
                        className="mt-1"
                        placeholder="Názov prevádzky"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1 font-medium">{location.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Adresa</Label>
                    {isEditMode ? (
                      <div className="space-y-2 mt-1">
                        <Input 
                          value={location.address?.street || ''} 
                          onChange={(e) => onUpdate(`businessLocations.${index}.address.street`, e.target.value)}
                          placeholder="Ulica a číslo"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            value={location.address?.city || ''} 
                            onChange={(e) => onUpdate(`businessLocations.${index}.address.city`, e.target.value)}
                            placeholder="Mesto"
                          />
                          <Input 
                            value={location.address?.zipCode || ''} 
                            onChange={(e) => onUpdate(`businessLocations.${index}.address.zipCode`, e.target.value)}
                            placeholder="PSČ"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-900 mt-1">
                        {location.address?.street}, {location.address?.city} {location.address?.zipCode}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">IBAN</Label>
                      {isEditMode ? (
                        <Input 
                          value={location.iban || ''} 
                          onChange={(e) => onUpdate(`businessLocations.${index}.iban`, e.target.value)}
                          className="mt-1"
                          placeholder="IBAN"
                        />
                      ) : (
                        <p className="text-slate-900 mt-1 font-mono text-sm">{location.iban}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">MCC sektor</Label>
                      {isEditMode ? (
                        <Input 
                          value={location.businessSector || ''} 
                          onChange={(e) => onUpdate(`businessLocations.${index}.businessSector`, e.target.value)}
                          className="mt-1"
                          placeholder="MCC sektor"
                        />
                      ) : (
                        <p className="text-slate-900 mt-1">{location.businessSector}</p>
                      )}
                    </div>
                  </div>
                </div>
              </EditableSection>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600">Žiadne prevádzky neboli zadané</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedClientOperationsSection;
