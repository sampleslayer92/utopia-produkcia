
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

  const handleCompanySelect = (result: CompanyRecognitionResult) => {
    console.log('handleCompanySelect called with:', result);
    
    // Clear previous auto-filled fields and start fresh
    const fieldsToUpdate = new Set<string>();

    try {
      // Always update company name with the exact name from search result
      console.log('Updating company name:', result.companyName);
      updateCompanyInfo('companyName', result.companyName);
      fieldsToUpdate.add('companyName');

      if (result.registryType) {
        console.log('Updating registry type:', result.registryType);
        updateCompanyInfo('registryType', result.registryType);
        fieldsToUpdate.add('registryType');
      }

      if (result.ico) {
        console.log('Updating ICO:', result.ico);
        updateCompanyInfo('ico', result.ico);
        fieldsToUpdate.add('ico');
      }

      if (result.dic) {
        console.log('Updating DIC:', result.dic);
        updateCompanyInfo('dic', result.dic);
        fieldsToUpdate.add('dic');
      }

      if (result.isVatPayer !== undefined) {
        console.log('Updating VAT payer status:', result.isVatPayer);
        updateCompanyInfo('isVatPayer', result.isVatPayer);
        fieldsToUpdate.add('isVatPayer');
      }

      if (result.court) {
        console.log('Updating court:', result.court);
        updateCompanyInfo('court', result.court);
        fieldsToUpdate.add('court');
      }

      if (result.section) {
        console.log('Updating section:', result.section);
        updateCompanyInfo('section', result.section);
        fieldsToUpdate.add('section');
      }

      if (result.insertNumber) {
        console.log('Updating insert number:', result.insertNumber);
        updateCompanyInfo('insertNumber', result.insertNumber);
        fieldsToUpdate.add('insertNumber');
      }

      // Auto-fill address if available
      if (result.address) {
        console.log('Updating address:', result.address);
        updateCompanyInfo('address.street', result.address.street);
        updateCompanyInfo('address.city', result.address.city);
        updateCompanyInfo('address.zipCode', result.address.zipCode);
        fieldsToUpdate.add('address.street');
        fieldsToUpdate.add('address.city');
        fieldsToUpdate.add('address.zipCode');
      }

      // Replace auto-filled fields completely with new selection
      setAutoFilledFields(fieldsToUpdate);
      
      console.log('Company selected and auto-filled:', {
        company: result.companyName,
        type: result.registryType,
        fieldsUpdated: Array.from(fieldsToUpdate)
      });
    } catch (error) {
      console.error('Error in handleCompanySelect:', error);
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
    setIsSearchModalOpen(true);
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
            onChange={(e) => {
              console.log('Company name changed via input:', e.target.value);
              updateCompanyInfo('companyName', e.target.value);
            }}
            placeholder="Zadajte obchodné meno spoločnosti"
            className={`flex-1 min-w-0 text-sm ${getFieldClassName('companyName')}`}
            icon={<Building2 className="h-4 w-4" />}
          />
          <CompanySearchButton 
            onClick={handleOpenSearchModal}
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
