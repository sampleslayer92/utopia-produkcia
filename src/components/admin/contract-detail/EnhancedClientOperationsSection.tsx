import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('admin');
  
  // Safely access nested data with fallbacks
  const companyInfo = onboardingData?.companyInfo || {};
  const contactInfo = onboardingData?.contactInfo || {};
  const businessLocations = onboardingData?.businessLocations || [];

  console.log('EnhancedClientOperationsSection render:', { 
    companyInfo, 
    contactInfo, 
    businessLocations,
    isEditMode,
    onboardingDataKeys: onboardingData ? Object.keys(onboardingData) : [],
    hasOnUpdate: typeof onUpdate === 'function'
  });

  const handleCompanyFieldChange = (field: string, value: string) => {
    console.log(`Updating company field ${field} with value:`, value);
    if (typeof onUpdate === 'function') {
      onUpdate(`companyInfo.${field}`, value);
    } else {
      console.error('onUpdate function is not available');
    }
  };

  const handleContactFieldChange = (field: string, value: string) => {
    console.log(`Updating contact field ${field} with value:`, value);
    if (typeof onUpdate === 'function') {
      onUpdate(`contactInfo.${field}`, value);
    } else {
      console.error('onUpdate function is not available');
    }
  };

  const handleAddressFieldChange = (addressType: 'address' | 'contactAddress', field: string, value: string) => {
    console.log(`Updating ${addressType}.${field} with value:`, value);
    if (typeof onUpdate === 'function') {
      onUpdate(`companyInfo.${addressType}.${field}`, value);
    } else {
      console.error('onUpdate function is not available');
    }
  };

  const handleBusinessLocationChange = (index: number, field: string, value: string) => {
    console.log(`Updating business location ${index}.${field} with value:`, value);
    if (typeof onUpdate === 'function') {
      onUpdate(`businessLocations.${index}.${field}`, value);
    } else {
      console.error('onUpdate function is not available');
    }
  };

  const handleBusinessLocationAddressChange = (index: number, field: string, value: string) => {
    console.log(`Updating business location ${index}.address.${field} with value:`, value);
    if (typeof onUpdate === 'function') {
      onUpdate(`businessLocations.${index}.address.${field}`, value);
    } else {
      console.error('onUpdate function is not available');
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900">
          <Building className="h-5 w-5 mr-2 text-blue-600" />
          {t('clientOperations.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Company Information */}
        <div className="space-y-6">
          <h4 className="font-medium text-blue-900 border-b border-blue-200 pb-2">
            {t('clientOperations.companyInfo')}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Data */}
            <div className="space-y-4">
              <h5 className="font-medium text-slate-700">{t('clientOperations.basicData')}</h5>
              
              <EditableSection isEditMode={isEditMode}>
                <div>
                  <Label className="text-sm font-medium text-slate-600">{t('clientOperations.companyName')}</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo.companyName || ''} 
                      onChange={(e) => handleCompanyFieldChange('companyName', e.target.value)}
                      className="mt-1" 
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo.companyName || t('contractActions.notSpecified')}</p>
                  )}
                </div>
              </EditableSection>

              <div className="grid grid-cols-2 gap-4">
                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.ico')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo.ico || ''} 
                        onChange={(e) => handleCompanyFieldChange('ico', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1 font-mono">{companyInfo.ico || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>

                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.dic')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo.dic || ''} 
                        onChange={(e) => handleCompanyFieldChange('dic', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1 font-mono">{companyInfo.dic || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>
              </div>

              <EditableSection isEditMode={isEditMode}>
                <div>
                  <Label className="text-sm font-medium text-slate-600">{t('clientOperations.vatNumber')}</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo.vatNumber || ''} 
                      onChange={(e) => handleCompanyFieldChange('vatNumber', e.target.value)}
                      className="mt-1" 
                    />
                  ) : (
                    <p className="text-slate-900 mt-1 font-mono">
                      {companyInfo.vatNumber || t('clientOperations.notVatPayer')}
                    </p>
                  )}
                </div>
              </EditableSection>
            </div>

            {/* Head Office Address */}
            <div className="space-y-4">
              <h5 className="font-medium text-slate-700">{t('clientOperations.headOfficeAddress')}</h5>
              
              <EditableSection isEditMode={isEditMode}>
                <div>
                  <Label className="text-sm font-medium text-slate-600">{t('clientOperations.streetAndNumber')}</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo.address?.street || ''} 
                      onChange={(e) => handleAddressFieldChange('address', 'street', e.target.value)}
                      className="mt-1" 
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo.address?.street || t('contractActions.notSpecified')}</p>
                  )}
                </div>
              </EditableSection>

              <div className="grid grid-cols-3 gap-4">
                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.city')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo.address?.city || ''} 
                        onChange={(e) => handleAddressFieldChange('address', 'city', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo.address?.city || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>

                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.zipCode')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo.address?.zipCode || ''} 
                        onChange={(e) => handleAddressFieldChange('address', 'zipCode', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo.address?.zipCode || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Person */}
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <h4 className="font-medium text-blue-900 border-b border-blue-200 pb-2">
            {t('clientOperations.contactPerson')}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.firstName')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={contactInfo.firstName || ''} 
                        onChange={(e) => handleContactFieldChange('firstName', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.firstName || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>

                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.lastName')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={contactInfo.lastName || ''} 
                        onChange={(e) => handleContactFieldChange('lastName', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.lastName || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.email')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={contactInfo.email || ''} 
                        onChange={(e) => handleContactFieldChange('email', e.target.value)}
                        type="email"
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.email || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>

                <EditableSection isEditMode={isEditMode}>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('clientOperations.phone')}</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={contactInfo.phone || ''} 
                        onChange={(e) => handleContactFieldChange('phone', e.target.value)}
                        className="mt-1" 
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{contactInfo.phone || t('contractActions.notSpecified')}</p>
                    )}
                  </div>
                </EditableSection>
              </div>
            </div>
          </div>
        </div>

        {/* Business Locations */}
        <div className="space-y-6 border-t border-slate-200 pt-6">
          <h4 className="font-medium text-blue-900 border-b border-blue-200 pb-2 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {t('clientOperations.businessLocations')}
          </h4>
          
          {businessLocations.length > 0 ? (
            <div className="space-y-6">
              {businessLocations.map((location: any, index: number) => (
                <div key={index} className="p-4 bg-blue-50/50 rounded-lg border border-blue-200/60">
                  <h5 className="font-medium text-blue-900 mb-4">
                    {t('clientOperations.location', { number: index + 1 })}
                  </h5>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <EditableSection isEditMode={isEditMode}>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.locationName')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={location.locationName || ''} 
                              onChange={(e) => handleBusinessLocationChange(index, 'locationName', e.target.value)}
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{location.locationName || t('contractActions.notSpecified')}</p>
                          )}
                        </div>
                      </EditableSection>

                      <EditableSection isEditMode={isEditMode}>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.address')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={location.address?.street || ''} 
                              onChange={(e) => handleBusinessLocationAddressChange(index, 'street', e.target.value)}
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">
                              {location.address ? `${location.address.street}, ${location.address.city} ${location.address.zipCode}` : t('contractActions.notSpecified')}
                            </p>
                          )}
                        </div>
                      </EditableSection>
                    </div>

                    <div className="space-y-4">
                      <EditableSection isEditMode={isEditMode}>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.iban')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={location.iban || ''} 
                              onChange={(e) => handleBusinessLocationChange(index, 'iban', e.target.value)}
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1 font-mono">{location.iban || t('contractActions.notSpecified')}</p>
                          )}
                        </div>
                      </EditableSection>

                      <EditableSection isEditMode={isEditMode}>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('clientOperations.businessSector')}</Label>
                          {isEditMode ? (
                            <Input 
                              defaultValue={location.mccCode || ''} 
                              onChange={(e) => handleBusinessLocationChange(index, 'mccCode', e.target.value)}
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1">{location.mccCode || t('contractActions.notSpecified')}</p>
                          )}
                        </div>
                      </EditableSection>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-8">
              {t('clientOperations.noLocations')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedClientOperationsSection;
