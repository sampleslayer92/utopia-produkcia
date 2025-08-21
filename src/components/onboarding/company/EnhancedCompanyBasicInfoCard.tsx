
import { useState, useCallback, useMemo } from "react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import CompanySearchModal from "../ui/CompanySearchModal";
import CompanySearchButton from "../ui/CompanySearchButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle, Loader2 } from "lucide-react";
import { CompanyRecognitionResult } from "../services/aresCompanyService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

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
  const { toast } = useToast();
  const { t } = useTranslation('forms');

  // Helper to check if field is enabled in config
  const isFieldEnabled = (fieldKey: string) => {
    if (!customFields) return true; // Default behavior when no config
    const field = customFields.find(f => f.fieldKey === fieldKey);
    return field ? field.isEnabled : false;
  };

  const handleCompanySelect = useCallback(async (result: CompanyRecognitionResult) => {
    console.log('=== COMPANY SELECT: Starting complete batch update ===');
    console.log('Selected company data:', result);
    
    setIsAutoFilling(true);
    
    try {
      // Build complete company info object with all updates
      const updatedCompanyInfo = {
        ...data.companyInfo
      };

      const fieldsToUpdate = new Set<string>();

      // Update all fields at once
      if (result.companyName) {
        console.log('Setting companyName:', result.companyName);
        updatedCompanyInfo.companyName = result.companyName;
        fieldsToUpdate.add('companyName');
      }

      if (result.registryType) {
        console.log('Setting registryType:', result.registryType);
        updatedCompanyInfo.registryType = result.registryType;
        fieldsToUpdate.add('registryType');
      }

      if (result.ico) {
        console.log('Setting ico:', result.ico);
        updatedCompanyInfo.ico = result.ico;
        fieldsToUpdate.add('ico');
      }

      if (result.dic) {
        console.log('Setting dic:', result.dic);
        updatedCompanyInfo.dic = result.dic;
        fieldsToUpdate.add('dic');
      }

      if (result.isVatPayer !== undefined) {
        console.log('Setting isVatPayer:', result.isVatPayer);
        updatedCompanyInfo.isVatPayer = result.isVatPayer;
        fieldsToUpdate.add('isVatPayer');
      }

      if (result.court) {
        console.log('Setting court:', result.court);
        updatedCompanyInfo.court = result.court;
        fieldsToUpdate.add('court');
      }

      if (result.section) {
        console.log('Setting section:', result.section);
        updatedCompanyInfo.section = result.section;
        fieldsToUpdate.add('section');
      }

      if (result.insertNumber) {
        console.log('Setting insertNumber:', result.insertNumber);
        updatedCompanyInfo.insertNumber = result.insertNumber;
        fieldsToUpdate.add('insertNumber');
      }

      // Handle address as a complete object
      if (result.address) {
        console.log('Setting complete address:', result.address);
        updatedCompanyInfo.address = {
          street: result.address.street || '',
          city: result.address.city || '',
          zipCode: result.address.zipCode || ''
        };
        fieldsToUpdate.add('address.street');
        fieldsToUpdate.add('address.city');
        fieldsToUpdate.add('address.zipCode');
      }

      console.log('=== APPLYING COMPLETE BATCH UPDATE ===');
      console.log('Complete updated company info:', updatedCompanyInfo);
      
      // Apply all updates in one batch operation
      updateCompanyInfo('batchUpdate', updatedCompanyInfo);
      
      // Set auto-filled fields after successful update
      console.log('Setting auto-filled fields:', Array.from(fieldsToUpdate));
      setAutoFilledFields(fieldsToUpdate);
      
      // Show success toast
      toast({
        title: t('companyInfo.notifications.companyDataUpdated'),
        description: t('companyInfo.notifications.companyDataUpdatedDescription', { companyName: result.companyName }),
      });
      
      console.log('=== BATCH UPDATE COMPLETED SUCCESSFULLY ===');
      
    } catch (error) {
      console.error('Error in handleCompanySelect batch update:', error);
      toast({
        title: t('companyInfo.notifications.updateError'),
        description: t('companyInfo.notifications.updateErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsAutoFilling(false);
    }
  }, [data.companyInfo, updateCompanyInfo, setAutoFilledFields, toast, t]);

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
      case 'address.street':
        hasValue = !!data.companyInfo.address?.street?.trim();
        break;
      case 'address.city':
        hasValue = !!data.companyInfo.address?.city?.trim();
        break;
      case 'address.zipCode':
        hasValue = !!data.companyInfo.address?.zipCode?.toString()?.trim();
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
    console.log('=== ENHANCED CARD: Opening search modal ===');
    console.log('Current company name for search:', data.companyInfo.companyName);
    setIsSearchModalOpen(true);
  }, [data.companyInfo.companyName]);

  const handleCompanyNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent changes during auto-filling process
    if (isAutoFilling) {
      console.log('Ignoring manual change during auto-fill process');
      return;
    }

    const newValue = e.target.value;
    console.log('=== ENHANCED CARD: Manual company name change ===');
    console.log('From:', data.companyInfo.companyName);
    console.log('To:', newValue);
    
    // If user manually changes the name, remove it from auto-filled fields
    if (autoFilledFields.has('companyName')) {
      const newAutoFilledFields = new Set(autoFilledFields);
      newAutoFilledFields.delete('companyName');
      setAutoFilledFields(newAutoFilledFields);
      console.log('Removed companyName from auto-filled fields');
    }
    
    updateCompanyInfo('companyName', newValue);
  }, [isAutoFilling, data.companyInfo.companyName, autoFilledFields, setAutoFilledFields, updateCompanyInfo]);

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

  const handleCourtChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('court', e.target.value);
  }, [updateCompanyInfo]);

  const handleSectionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('section', e.target.value);
  }, [updateCompanyInfo]);

  const handleInsertNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateCompanyInfo('insertNumber', e.target.value);
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

      {/* Company Name - with search button and wider field */}
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

      {/* Court Registry Information - editable fields */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h4 className="text-md font-medium text-slate-900">{t('companyInfo.basicInfoCard.registryDataTitle')}</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <OnboardingInput
              label={t('companyInfo.labels.courtLabel')}
              value={data.companyInfo.court}
              onChange={handleCourtChange}
              placeholder={t('companyInfo.placeholders.court')}
              className={`transition-all duration-300 ${getFieldClassName('court')}`}
              disabled={isAutoFilling}
            />
            {getFieldIndicator('court')}
          </div>
          
          <div className="space-y-2">
            <OnboardingInput
              label={t('companyInfo.labels.sectionLabel')}
              value={data.companyInfo.section}
              onChange={handleSectionChange}
              placeholder={t('companyInfo.placeholders.section')}
              className={`transition-all duration-300 ${getFieldClassName('section')}`}
              disabled={isAutoFilling}
            />
            {getFieldIndicator('section')}
          </div>
          
          <div className="space-y-2">
            <OnboardingInput
              label={t('companyInfo.labels.insertNumberLabel')}
              value={data.companyInfo.insertNumber}
              onChange={handleInsertNumberChange}
              placeholder={t('companyInfo.placeholders.insertNumber')}
              className={`transition-all duration-300 ${getFieldClassName('insertNumber')}`}
              disabled={isAutoFilling}
            />
            {getFieldIndicator('insertNumber')}
          </div>
        </div>
      </div>

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
