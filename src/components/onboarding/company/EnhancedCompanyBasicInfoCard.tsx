import { useState, useCallback, useMemo } from "react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import CompanySearchModal from "../ui/CompanySearchModal";
import CompanySearchButton from "../ui/CompanySearchButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle, Loader2 } from "lucide-react";
import { CompanyRecognitionResultExtended } from "../services/aresCompanyService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RegistrationFieldsDisplay } from "./RegistrationFieldsDisplay";

interface EnhancedCompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
  setAutoFilledFields: (fields: Set<string>) => void;
  customFields?: Array<{ id?: string; fieldKey: string; fieldLabel: string; fieldType: string; isRequired: boolean; isEnabled: boolean; position?: number; fieldOptions?: any; }>;
}

const EnhancedCompanyBasicInfoCard = ({ 
  data, 
  updateCompanyInfo, 
  autoFilledFields, 
  setAutoFilledFields,
  customFields 
}: EnhancedCompanyBasicInfoCardProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const { t } = useTranslation('forms');

  // Helper to check if field is enabled in config
  const isFieldEnabled = useCallback((fieldKey: string) => {
    if (!customFields) return true; // Default behavior when no config
    const field = customFields.find(f => f.fieldKey === fieldKey);
    return field ? field.isEnabled : false;
  }, [customFields]);

  const handleCompanySelect = useCallback(async (company: CompanyRecognitionResultExtended) => {
    setIsAutoFilling(true);
    
    try {
      const fieldsToUpdate = new Set<string>();
      
      // Basic company info
      if (company.companyName) {
        updateCompanyInfo('companyName', company.companyName);
        fieldsToUpdate.add('companyName');
      }
      
      if (company.ico) {
        updateCompanyInfo('ico', company.ico);
        fieldsToUpdate.add('ico');
      }
      
      if (company.dic) {
        updateCompanyInfo('dic', company.dic);
        fieldsToUpdate.add('dic');
      }
      
      if (company.registryType) {
        updateCompanyInfo('registryType', company.registryType);
        fieldsToUpdate.add('registryType');
      }
      
      if (company.isVatPayer !== undefined) {
        updateCompanyInfo('isVatPayer', company.isVatPayer);
        fieldsToUpdate.add('isVatPayer');
        
        if (company.isVatPayer && company.dic) {
          updateCompanyInfo('vatNumber', `SK${company.dic}`);
          fieldsToUpdate.add('vatNumber');
        }
      }
      
      // Address info
      if (company.address) {
        updateCompanyInfo('address', {
          street: company.address.street || '',
          city: company.address.city || '',
          zipCode: company.address.zipCode || ''
        });
        fieldsToUpdate.add('address');
      }
      
      // Enhanced registration info handling
      if (company.registrationInfo) {
        // Update new structured registration info
        updateCompanyInfo('registrationInfo', company.registrationInfo);
        fieldsToUpdate.add('registrationInfo');
        
        // Also update legacy fields for backward compatibility
        if (company.registrationInfo.court) {
          updateCompanyInfo('court', company.registrationInfo.court);
          fieldsToUpdate.add('court');
        }
        if (company.registrationInfo.section) {
          updateCompanyInfo('section', company.registrationInfo.section);
          fieldsToUpdate.add('section');
        }
        if (company.registrationInfo.insertNumber) {
          updateCompanyInfo('insertNumber', company.registrationInfo.insertNumber);
          fieldsToUpdate.add('insertNumber');
        }
      } else {
        // Fallback to legacy fields
        if (company.court) {
          updateCompanyInfo('court', company.court);
          fieldsToUpdate.add('court');
        }
        if (company.section) {
          updateCompanyInfo('section', company.section);
          fieldsToUpdate.add('section');
        }
        if (company.insertNumber) {
          updateCompanyInfo('insertNumber', company.insertNumber);
          fieldsToUpdate.add('insertNumber');
        }
      }
      
      // Update auto-filled fields tracking
      setAutoFilledFields(new Set(fieldsToUpdate));
      
      setIsSearchModalOpen(false);
      toast.success("Údaje spoločnosti boli úspešne doplnené z ARES registra");
      
    } catch (error) {
      console.error('Error auto-filling company data:', error);
      toast.error("Nastala chyba pri dopĺňaní údajov spoločnosti");
    } finally {
      setIsAutoFilling(false);
    }
  }, [updateCompanyInfo, setAutoFilledFields, setIsSearchModalOpen]);

  const getFieldClassName = useCallback((fieldName: string) => {
    return autoFilledFields.has(fieldName) ? 'bg-green-50 border-green-200' : '';
  }, [autoFilledFields]);

  const getFieldIndicator = useCallback((fieldName: string) => {
    const isAutoFilled = autoFilledFields.has(fieldName);
    let hasValue = false;

    // Check if the field actually has a value
    switch (fieldName) {
      case 'companyName':
        hasValue = !!data.companyInfo.companyName?.trim();
        break;
      case 'ico':
        hasValue = !!data.companyInfo.ico?.trim();
        break;
      case 'dic':
        hasValue = !!data.companyInfo.dic?.trim();
        break;
      case 'court':
        hasValue = !!data.companyInfo.court?.trim();
        break;
      case 'section':
        hasValue = !!data.companyInfo.section?.trim();
        break;
      case 'insertNumber':
        hasValue = !!data.companyInfo.insertNumber?.trim();
        break;
      case 'registryType':
        hasValue = !!data.companyInfo.registryType?.trim();
        break;
      case 'isVatPayer':
        hasValue = data.companyInfo.isVatPayer !== undefined;
        break;
      case 'tradeOffice':
        hasValue = !!data.companyInfo.registrationInfo?.tradeOffice?.trim();
        break;
      case 'tradeLicenseNumber':
        hasValue = !!data.companyInfo.registrationInfo?.tradeLicenseNumber?.trim();
        break;
      case 'registrationAuthority':
        hasValue = !!data.companyInfo.registrationInfo?.registrationAuthority?.trim();
        break;
      case 'registrationNumber':
        hasValue = !!data.companyInfo.registrationInfo?.registrationNumber?.trim();
        break;
      default:
        hasValue = false;
    }

    if (isAutoFilled && hasValue) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1 animate-fade-in">
          <CheckCircle className="h-3 w-3" />
          <span>{t('companyInfo.basicInfoCard.autoFilledIndicator')}</span>
        </div>
      );
    }
    return null;
  }, [autoFilledFields, data.companyInfo, t]);

  const handleOpenSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const handleCompanyNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAutoFilling) return;

    const newValue = e.target.value;
    
    // If user manually changes the name, remove it from auto-filled fields
    if (autoFilledFields.has('companyName')) {
      const newAutoFilledFields = new Set(autoFilledFields);
      newAutoFilledFields.delete('companyName');
      setAutoFilledFields(newAutoFilledFields);
    }
    
    updateCompanyInfo('companyName', newValue);
  }, [isAutoFilling, autoFilledFields, setAutoFilledFields, updateCompanyInfo]);

  const handleVatChange = useCallback((checked: boolean) => {
    updateCompanyInfo('isVatPayer', checked);
  }, [updateCompanyInfo]);

  const handleIcoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('ico', e.target.value);
  }, [updateCompanyInfo]);

  const handleDicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('dic', e.target.value);
  }, [updateCompanyInfo]);

  const handleVatNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('vatNumber', e.target.value);
  }, [updateCompanyInfo]);

  // Memoized registry display section
  const registryDisplaySection = useMemo(() => {
    if (!(data.companyInfo.section || data.companyInfo.insertNumber)) {
      return null;
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          {t('companyInfo.basicInfoCard.registryInfoTitle')}
        </label>
        <div className={`p-3 border rounded-md bg-slate-50 text-sm transition-all duration-300 ${getFieldClassName('registryType')}`}>
          <div className="space-y-1">
            {data.companyInfo.section && data.companyInfo.insertNumber && (
              <div>
                <span className="font-medium">{t('companyInfo.labels.sectionLabel')}:</span> {data.companyInfo.section} | 
                <span className="font-medium"> {t('companyInfo.labels.insertNumberLabel')} číslo:</span> {data.companyInfo.insertNumber}
              </div>
            )}
            {data.companyInfo.companyName && (
              <div>
                <span className="font-medium">{t('companyInfo.companyName')}:</span> {data.companyInfo.companyName}
              </div>
            )}
            {data.companyInfo.registryType && (
              <div>
                <span className="font-medium">Právna forma:</span> {data.companyInfo.registryType}
              </div>
            )}
          </div>
        </div>
        {getFieldIndicator('section')}
      </div>
    );
  }, [data.companyInfo.section, data.companyInfo.insertNumber, data.companyInfo.companyName, data.companyInfo.registryType, getFieldClassName, getFieldIndicator, t]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('companyInfo.basicInfoCard.title')}</h3>
        {isAutoFilling && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('companyInfo.basicInfoCard.autoFilling')}</span>
          </div>
        )}
      </div>

      {/* Company Name - with search button */}
      {isFieldEnabled('companyName') && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            {t('companyInfo.basicInfoCard.companyNameLabel')}
          </label>
          <div className="flex gap-2">
            <OnboardingInput
              value={data.companyInfo.companyName}
              onChange={handleCompanyNameChange}
              placeholder={t('companyInfo.basicInfoCard.companyNamePlaceholder')}
              className={`flex-1 min-w-0 text-sm transition-all duration-300 ${getFieldClassName('companyName')}`}
              icon={<Building2 className="h-4 w-4" />}
              disabled={isAutoFilling}
            />
            <CompanySearchButton 
              onClick={handleOpenSearchModal}
              disabled={isAutoFilling}
            />
          </div>
      {getFieldIndicator('companyName')}
      
      {/* Debug info - show what data we received */}
      {data.companyInfo.registrationInfo && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <div className="font-medium text-blue-800 mb-1">Debug - Registration Info:</div>
          <pre className="text-blue-700">{JSON.stringify(data.companyInfo.registrationInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  )}

  {/* Registry Info Template - Slovak format display */}
  {registryDisplaySection}

      {/* IČO and DIČ */}
      <div className="grid md:grid-cols-2 gap-6">
        {isFieldEnabled('ico') && (
          <div className="space-y-2">
            <OnboardingInput
              label={t('companyInfo.labels.icoRequired')}
              value={data.companyInfo.ico}
              onChange={handleIcoChange}
              placeholder={t('companyInfo.placeholders.ico')}
              className={`transition-all duration-300 ${getFieldClassName('ico')}`}
              icon={<Building2 className="h-4 w-4" />}
              disabled={isAutoFilling}
            />
            {getFieldIndicator('ico')}
          </div>
        )}
        
        {isFieldEnabled('dic') && (
          <div className="space-y-2">
            <OnboardingInput
              label={t('companyInfo.labels.dicRequired')}
              value={data.companyInfo.dic}
              onChange={handleDicChange}
              placeholder={t('companyInfo.placeholders.dic')}
              className={`transition-all duration-300 ${getFieldClassName('dic')}`}
              disabled={isAutoFilling}
            />
            {getFieldIndicator('dic')}
          </div>
        )}
      </div>

      {/* VAT Payer Section */}
      {isFieldEnabled('isVatPayer') && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVatPayer"
              checked={data.companyInfo.isVatPayer}
              onCheckedChange={handleVatChange}
              disabled={isAutoFilling}
            />
            <label htmlFor="isVatPayer" className="text-sm font-medium text-slate-700">
              {t('companyInfo.basicInfoCard.vatPayerLabel')}
            </label>
            {getFieldIndicator('isVatPayer')}
          </div>

          {data.companyInfo.isVatPayer && isFieldEnabled('vatNumber') && (
            <OnboardingInput
              label={t('companyInfo.labels.vatNumberRequired')}
              value={data.companyInfo.vatNumber}
              onChange={handleVatNumberChange}
              placeholder={t('companyInfo.placeholders.vatNumber')}
              disabled={isAutoFilling}
            />
          )}
        </div>
      )}

      {/* Registration Fields - Dynamic based on company type */}
      <RegistrationFieldsDisplay
        companyInfo={data.companyInfo}
        updateCompanyInfo={updateCompanyInfo}
        autoFilledFields={autoFilledFields}
        getFieldClassName={getFieldClassName}
        getFieldIndicator={getFieldIndicator}
        isFieldEnabled={isFieldEnabled}
      />

      {/* Company Search Modal */}
      <CompanySearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        onCompanySelect={handleCompanySelect}
        initialQuery={data.companyInfo.companyName}
      />
    </div>
  );
};

export default EnhancedCompanyBasicInfoCard;