
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import CompanySearchModal from "../ui/CompanySearchModal";
import CompanySearchButton from "../ui/CompanySearchButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle } from "lucide-react";
import { CompanyRecognitionResult } from "../services/mockCompanyRecognition";

interface EnhancedCompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
  setAutoFilledFields: (fields: Set<string>) => void;
}

const EnhancedCompanyBasicInfoCard = ({ 
  data, 
  updateCompanyInfo, 
  autoFilledFields, 
  setAutoFilledFields 
}: EnhancedCompanyBasicInfoCardProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  const handleCompanySelect = (result: CompanyRecognitionResult) => {
    console.log('=== COMPANY SELECT: Starting complete batch update ===');
    console.log('Selected company data:', result);
    console.log('Current data before update:', {
      companyName: data.companyInfo.companyName,
      ico: data.companyInfo.ico,
      dic: data.companyInfo.dic,
      address: data.companyInfo.address
    });
    
    setIsAutoFilling(true);
    setAutoFilledFields(new Set()); // Clear previous auto-filled state
    
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
      
      console.log('=== BATCH UPDATE COMPLETED SUCCESSFULLY ===');
      
    } catch (error) {
      console.error('Error in handleCompanySelect batch update:', error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const getFieldClassName = (fieldName: string) => {
    return autoFilledFields.has(fieldName) ? 'bg-green-50 border-green-200' : '';
  };

  const getFieldIndicator = (fieldName: string) => {
    // Check if field is auto-filled AND has a value
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
        hasValue = !!data.companyInfo.address?.zipCode?.trim();
        break;
      default:
        hasValue = false;
    }

    if (isAutoFilled && hasValue) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
          <CheckCircle className="h-3 w-3" />
          <span>Automaticky vyplnené</span>
        </div>
      );
    }
    return null;
  };

  const handleOpenSearchModal = () => {
    console.log('=== ENHANCED CARD: Opening search modal ===');
    console.log('Current company name for search:', data.companyInfo.companyName);
    setIsSearchModalOpen(true);
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Základné údaje o spoločnosti</h3>
      </div>

      {/* Company Name - with search button and wider field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Obchodné meno spoločnosti *
        </label>
        <div className="flex gap-2">
          <OnboardingInput
            value={data.companyInfo.companyName}
            onChange={handleCompanyNameChange}
            placeholder="Zadajte obchodné meno spoločnosti"
            className={`flex-1 min-w-0 text-sm ${getFieldClassName('companyName')}`}
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

      {/* Registry Info Template - Slovak format display */}
      {(data.companyInfo.section || data.companyInfo.insertNumber) && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Údaje z obchodného registra
          </label>
          <div className={`p-3 border rounded-md bg-slate-50 text-sm ${getFieldClassName('registryType')}`}>
            <div className="space-y-1">
              {data.companyInfo.section && data.companyInfo.insertNumber && (
                <div>
                  <span className="font-medium">Oddiel:</span> {data.companyInfo.section} | 
                  <span className="font-medium"> Vložka číslo:</span> {data.companyInfo.insertNumber}
                </div>
              )}
              {data.companyInfo.companyName && (
                <div>
                  <span className="font-medium">Obchodné meno:</span> {data.companyInfo.companyName}
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
      )}

      {/* IČO and DIČ */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <OnboardingInput
            label="IČO *"
            value={data.companyInfo.ico}
            onChange={(e) => updateCompanyInfo('ico', e.target.value)}
            placeholder="12345678"
            className={getFieldClassName('ico')}
            icon={<Building2 className="h-4 w-4" />}
          />
          {getFieldIndicator('ico')}
        </div>
        
        <div className="space-y-2">
          <OnboardingInput
            label="DIČ *"
            value={data.companyInfo.dic}
            onChange={(e) => updateCompanyInfo('dic', e.target.value)}
            placeholder="2012345678"
            className={getFieldClassName('dic')}
          />
          {getFieldIndicator('dic')}
        </div>
      </div>

      {/* VAT Payer Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVatPayer"
            checked={data.companyInfo.isVatPayer}
            onCheckedChange={(checked) => updateCompanyInfo('isVatPayer', checked)}
          />
          <label htmlFor="isVatPayer" className="text-sm font-medium text-slate-700">
            Je platcom DPH
          </label>
          {getFieldIndicator('isVatPayer')}
        </div>

        {data.companyInfo.isVatPayer && (
          <OnboardingInput
            label="IČ DPH *"
            value={data.companyInfo.vatNumber}
            onChange={(e) => updateCompanyInfo('vatNumber', e.target.value)}
            placeholder="SK2012345678"
          />
        )}
      </div>

      {/* Court Registry Information - editable fields */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h4 className="text-md font-medium text-slate-900">Údaje v obchodnom registri</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <OnboardingInput
              label="Súd"
              value={data.companyInfo.court}
              onChange={(e) => updateCompanyInfo('court', e.target.value)}
              placeholder="Okresný súd"
              className={getFieldClassName('court')}
            />
            {getFieldIndicator('court')}
          </div>
          
          <div className="space-y-2">
            <OnboardingInput
              label="Oddiel"
              value={data.companyInfo.section}
              onChange={(e) => updateCompanyInfo('section', e.target.value)}
              placeholder="Sro"
              className={getFieldClassName('section')}
            />
            {getFieldIndicator('section')}
          </div>
          
          <div className="space-y-2">
            <OnboardingInput
              label="Vložka"
              value={data.companyInfo.insertNumber}
              onChange={(e) => updateCompanyInfo('insertNumber', e.target.value)}
              placeholder="12345/B"
              className={getFieldClassName('insertNumber')}
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
