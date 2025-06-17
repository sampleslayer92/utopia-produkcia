import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useLocalFormState } from "@/hooks/useLocalFormState";
import { useEffect } from 'react';
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
  
  // Use local form state for editing
  const {
    localData,
    hasLocalChanges,
    updateLocalField,
    resetLocalData,
    commitLocalChanges
  } = useLocalFormState(onboardingData);

  // Use local data when in edit mode, otherwise use original data
  const currentData = isEditMode ? (localData || onboardingData) : onboardingData;

  // Safely access nested data with fallbacks
  const companyInfo = currentData?.companyInfo || {};
  const contactInfo = currentData?.contactInfo || {};
  const businessLocations = currentData?.businessLocations || [];

  console.log('EnhancedClientOperationsSection render:', { 
    companyInfo, 
    contactInfo, 
    businessLocations,
    isEditMode,
    hasLocalChanges,
    currentDataKeys: currentData ? Object.keys(currentData) : []
  });

  // Reset local data when exiting edit mode
  useEffect(() => {
    if (!isEditMode) {
      resetLocalData();
    }
  }, [isEditMode, resetLocalData]);

  // Commit changes when save is triggered (this will be called from parent)
  useEffect(() => {
    if (hasLocalChanges && !isEditMode) {
      const committedData = commitLocalChanges();
      if (committedData && onSectionUpdate) {
        onSectionUpdate(committedData);
      }
    }
  }, [isEditMode, hasLocalChanges, commitLocalChanges, onSectionUpdate]);

  const handleCompanyFieldChange = (field: string, value: string) => {
    console.log(`Updating company field ${field} with value:`, value);
    updateLocalField(`companyInfo.${field}`, value);
  };

  const handleContactFieldChange = (field: string, value: string) => {
    console.log(`Updating contact field ${field} with value:`, value);
    updateLocalField(`contactInfo.${field}`, value);
  };

  const handleAddressFieldChange = (addressType: 'address' | 'contactAddress', field: string, value: string) => {
    console.log(`Updating ${addressType}.${field} with value:`, value);
    updateLocalField(`companyInfo.${addressType}.${field}`, value);
  };

  const handleBusinessLocationChange = (index: number, field: string, value: string) => {
    console.log(`Updating business location ${index}.${field} with value:`, value);
    updateLocalField(`businessLocations.${index}.${field}`, value);
  };

  const handleBusinessLocationAddressChange = (index: number, field: string, value: string) => {
    console.log(`Updating business location ${index}.address.${field} with value:`, value);
    updateLocalField(`businessLocations.${index}.address.${field}`, value);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900">
          <Building className="h-5 w-5 mr-2 text-blue-600" />
          {t('clientOperations.title')}
          {hasLocalChanges && isEditMode && (
            <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
              Neuložené zmeny
            </span>
          )}
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
                      value={companyInfo.companyName || ''} 
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
                        value={companyInfo.ico || ''} 
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
                        value={companyInfo.dic || ''} 
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
                      value={companyInfo.vatNumber || ''} 
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
                      value={companyInfo.address?.street || ''} 
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
                        value={companyInfo.address?.city || ''} 
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
                        value={companyInfo.address?.zipCode || ''} 
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
                        value={contactInfo.firstName || ''} 
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
                        value={contactInfo.lastName || ''} 
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
                        value={contactInfo.email || ''} 
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
                        value={contactInfo.phone || ''} 
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
                              value={location.locationName || ''} 
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
                              value={location.address?.street || ''} 
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
                              value={location.iban || ''} 
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
                              value={location.mccCode || ''} 
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
