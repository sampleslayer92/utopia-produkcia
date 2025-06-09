
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Building, Search, CheckCircle, Loader2 } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import { OnboardingData } from "@/types/onboarding";
import { mockCompanySearch } from "../utils/mockCompanySearch";

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search results
    const results = mockCompanySearch(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  }, [searchQuery]);

  const handleCompanySelect = useCallback((company: any) => {
    console.log('Selected company:', company);
    updateCompanyInfo('batchUpdate', {
      ico: company.ico,
      dic: company.dic,
      companyName: company.name,
      address: {
        street: company.street,
        city: company.city,
        zipCode: company.zipCode
      },
      court: company.court,
      section: company.section,
      insertNumber: company.insertNumber
    });

    setAutoFilledFields(new Set(['ico', 'dic', 'companyName', 'address.street', 'address.city', 'address.zipCode', 'court', 'section', 'insertNumber']));
    setSearchResults([]);
    setSearchQuery('');
  }, [updateCompanyInfo, setAutoFilledFields]);

  useEffect(() => {
    if (data.companyInfo.companyName && !autoFilledFields.has('companyName')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'companyName']));
    }
    if (data.companyInfo.ico && !autoFilledFields.has('ico')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'ico']));
    }
    if (data.companyInfo.dic && !autoFilledFields.has('dic')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'dic']));
    }
    if (data.companyInfo.court && !autoFilledFields.has('court')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'court']));
    }
    if (data.companyInfo.section && !autoFilledFields.has('section')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'section']));
    }
    if (data.companyInfo.insertNumber && !autoFilledFields.has('insertNumber')) {
      setAutoFilledFields(new Set([...autoFilledFields, 'insertNumber']));
    }
  }, [data.companyInfo, setAutoFilledFields, autoFilledFields]);

  const registryTypeOptions = [
    { value: "obchodny_register", label: "Obchodný register" },
    { value: "zivnostensky_register", label: "Živnostenský register" },
    { value: "iny", label: "Iný" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Building className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-medium text-slate-900">{t('steps.companyInfo.basicInfo.title')}</h3>
      </div>

      {/* Company Search */}
      <div className="relative">
        <div className="flex gap-2">
          <OnboardingInput
            label={t('steps.companyInfo.searchCompany')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('steps.companyInfo.searchPlaceholder')}
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-3 border border-slate-200 rounded-lg bg-white shadow-sm max-h-60 overflow-y-auto">
            {searchResults.map((company, index) => (
              <div
                key={index}
                onClick={() => handleCompanySelect(company)}
                className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
              >
                <div className="font-medium text-slate-900">{company.name}</div>
                <div className="text-sm text-slate-600">IČO: {company.ico}</div>
                <div className="text-xs text-slate-500">{company.street}, {company.city}</div>
              </div>
            ))}
          </div>
        )}

        {hasSearched && searchResults.length === 0 && !isSearching && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">Žiadne výsledky. Vyplňte údaje manuálne.</p>
          </div>
        )}
      </div>

      {/* Company Information Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <OnboardingInput
          label={t('steps.companyInfo.basicInfo.ico')}
          value={data.companyInfo.ico || ''}
          onChange={(e) => updateCompanyInfo('ico', e.target.value)}
          placeholder={t('steps.companyInfo.placeholders.ico')}
          className={autoFilledFields.has('ico') ? 'bg-green-50 border-green-200' : ''}
          suffix={autoFilledFields.has('ico') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
        />

        <OnboardingInput
          label={t('steps.companyInfo.basicInfo.dic')}
          value={data.companyInfo.dic || ''}
          onChange={(e) => updateCompanyInfo('dic', e.target.value)}
          placeholder="SK1234567890"
          className={autoFilledFields.has('dic') ? 'bg-green-50 border-green-200' : ''}
          suffix={autoFilledFields.has('dic') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
        />
      </div>

      <OnboardingInput
        label={t('steps.companyInfo.basicInfo.companyName')}
        value={data.companyInfo.companyName || ''}
        onChange={(e) => updateCompanyInfo('companyName', e.target.value)}
        placeholder={t('steps.companyInfo.placeholders.companyName')}
        className={autoFilledFields.has('companyName') ? 'bg-green-50 border-green-200' : ''}
        suffix={autoFilledFields.has('companyName') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
      />

      <OnboardingSelect
        label={t('steps.companyInfo.basicInfo.registryType')}
        value={data.companyInfo.registryType || ''}
        onValueChange={(value) => updateCompanyInfo('registryType', value)}
        options={registryTypeOptions}
        placeholder="Vyberte typ registra"
      />

      {/* VAT Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isVatPayer"
            checked={data.companyInfo.isVatPayer || false}
            onCheckedChange={(checked) => updateCompanyInfo('isVatPayer', checked)}
          />
          <label htmlFor="isVatPayer" className="text-sm font-medium text-slate-700">
            {t('steps.companyInfo.basicInfo.isVatPayer')}
          </label>
        </div>

        {data.companyInfo.isVatPayer && (
          <OnboardingInput
            label={t('steps.companyInfo.basicInfo.vatNumber')}
            value={data.companyInfo.vatNumber || ''}
            onChange={(e) => updateCompanyInfo('vatNumber', e.target.value)}
            placeholder="SK1234567890"
          />
        )}
      </div>

      {/* Commercial Register Information */}
      <div className="border-t border-slate-200 pt-4 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <OnboardingInput
            label={t('steps.companyInfo.basicInfo.court')}
            value={data.companyInfo.court || ''}
            onChange={(e) => updateCompanyInfo('court', e.target.value)}
            placeholder="Okresný súd Bratislava I"
            className={autoFilledFields.has('court') ? 'bg-green-50 border-green-200' : ''}
            suffix={autoFilledFields.has('court') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
          />

          <OnboardingInput
            label={t('steps.companyInfo.basicInfo.section')}
            value={data.companyInfo.section || ''}
            onChange={(e) => updateCompanyInfo('section', e.target.value)}
            placeholder="Sro"
            className={autoFilledFields.has('section') ? 'bg-green-50 border-green-200' : ''}
            suffix={autoFilledFields.has('section') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
          />

          <OnboardingInput
            label={t('steps.companyInfo.basicInfo.insertNumber')}
            value={data.companyInfo.insertNumber || ''}
            onChange={(e) => updateCompanyInfo('insertNumber', e.target.value)}
            placeholder="12345/B"
            className={autoFilledFields.has('insertNumber') ? 'bg-green-50 border-green-200' : ''}
            suffix={autoFilledFields.has('insertNumber') ? <CheckCircle className="h-4 w-4 text-green-600" /> : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCompanyBasicInfoCard;
