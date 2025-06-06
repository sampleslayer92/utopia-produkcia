
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import CompanyAutocomplete from "../ui/CompanyAutocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle } from "lucide-react";
import { CompanyRecognitionResult } from "../services/mockCompanyRecognition";

interface EnhancedCompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const EnhancedCompanyBasicInfoCard = ({ data, updateCompanyInfo }: EnhancedCompanyBasicInfoCardProps) => {
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());

  const handleCompanySelect = (result: CompanyRecognitionResult) => {
    console.log('handleCompanySelect called with:', result);
    const fieldsToUpdate = new Set<string>();

    try {
      // Update company info with recognized data
      if (result.companyName && result.companyName !== data.companyInfo.companyName) {
        console.log('Updating company name:', result.companyName);
        updateCompanyInfo('companyName', result.companyName);
        fieldsToUpdate.add('companyName');
      }

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
    if (autoFilledFields.has(fieldName)) {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
          <CheckCircle className="h-3 w-3" />
          <span>Automaticky vyplnené</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-slate-900">Základné údaje o spoločnosti</h3>
      </div>

      {/* Company Name - Now with autocomplete */}
      <div className="space-y-2">
        <CompanyAutocomplete
          value={data.companyInfo.companyName}
          onValueChange={(value) => {
            console.log('Company name changed via input:', value);
            updateCompanyInfo('companyName', value);
          }}
          onCompanySelect={handleCompanySelect}
          className={getFieldClassName('companyName')}
        />
        {getFieldIndicator('companyName')}
      </div>

      {/* Company Type - Read-only display when filled */}
      {data.companyInfo.registryType && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Typ spoločnosti *
          </label>
          <div className={`h-11 px-3 border rounded-md flex items-center text-sm ${getFieldClassName('registryType')}`}>
            {data.companyInfo.registryType}
          </div>
          {getFieldIndicator('registryType')}
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

      {/* Court Registry Information - moved from CompanyRegistryInfo */}
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
    </div>
  );
};

export default EnhancedCompanyBasicInfoCard;
