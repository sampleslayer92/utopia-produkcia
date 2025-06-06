
import { useState, useEffect } from "react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Search, CheckCircle, Loader2 } from "lucide-react";
import { recognizeCompanyFromName, CompanyRecognitionResult } from "../services/mockCompanyRecognition";

interface EnhancedCompanyBasicInfoCardProps {
  data: OnboardingData;
  updateCompanyInfo: (field: string, value: any) => void;
}

const EnhancedCompanyBasicInfoCard = ({ data, updateCompanyInfo }: EnhancedCompanyBasicInfoCardProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<Set<string>>(new Set());
  const [searchError, setSearchError] = useState<string>("");

  const registryTypeOptions = [
    { value: "Živnosť", label: "Živnosť" },
    { value: "S.r.o.", label: "S.r.o." },
    { value: "Nezisková organizácia", label: "Nezisková organizácia" },
    { value: "Akciová spoločnosť", label: "Akciová spoločnosť" }
  ];

  const handleCompanyNameChange = async (value: string) => {
    updateCompanyInfo('companyName', value);
    
    if (value.length >= 3) {
      setIsSearching(true);
      setSearchError("");
      
      try {
        const result = await recognizeCompanyFromName(value);
        if (result) {
          handleCompanyRecognition(result);
        }
      } catch (error) {
        setSearchError("Chyba pri vyhľadávaní spoločnosti");
        console.error('Company recognition error:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleCompanyRecognition = (result: CompanyRecognitionResult) => {
    const fieldsToUpdate = new Set<string>();

    // Update company info with recognized data
    if (result.companyName !== data.companyInfo.companyName) {
      updateCompanyInfo('companyName', result.companyName);
      fieldsToUpdate.add('companyName');
    }

    if (result.registryType) {
      updateCompanyInfo('registryType', result.registryType);
      fieldsToUpdate.add('registryType');
    }

    if (result.ico) {
      updateCompanyInfo('ico', result.ico);
      fieldsToUpdate.add('ico');
    }

    if (result.dic) {
      updateCompanyInfo('dic', result.dic);
      fieldsToUpdate.add('dic');
    }

    if (result.isVatPayer !== undefined) {
      updateCompanyInfo('isVatPayer', result.isVatPayer);
      fieldsToUpdate.add('isVatPayer');
    }

    if (result.court) {
      updateCompanyInfo('court', result.court);
      fieldsToUpdate.add('court');
    }

    if (result.section) {
      updateCompanyInfo('section', result.section);
      fieldsToUpdate.add('section');
    }

    if (result.insertNumber) {
      updateCompanyInfo('insertNumber', result.insertNumber);
      fieldsToUpdate.add('insertNumber');
    }

    setAutoFilledFields(fieldsToUpdate);
    
    console.log('Company recognized and auto-filled:', {
      company: result.companyName,
      type: result.registryType,
      fieldsUpdated: Array.from(fieldsToUpdate)
    });
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

      {/* Company Name - First field */}
      <div className="space-y-2">
        <div className="relative">
          <OnboardingInput
            label="Obchodné meno spoločnosti *"
            value={data.companyInfo.companyName}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            placeholder="Začnite písať názov spoločnosti..."
            className={getFieldClassName('companyName')}
            icon={isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          />
          {getFieldIndicator('companyName')}
          {searchError && (
            <p className="text-xs text-red-600 mt-1">{searchError}</p>
          )}
        </div>
      </div>

      {/* Company Type */}
      <div className="space-y-2">
        <OnboardingSelect
          label="Typ spoločnosti *"
          value={data.companyInfo.registryType}
          onValueChange={(value) => updateCompanyInfo('registryType', value)}
          options={registryTypeOptions}
          placeholder="Vyberte typ spoločnosti"
          className={getFieldClassName('registryType')}
        />
        {getFieldIndicator('registryType')}
      </div>

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
    </div>
  );
};

export default EnhancedCompanyBasicInfoCard;
