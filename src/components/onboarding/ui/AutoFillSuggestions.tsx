import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { User, CheckCircle } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { useState } from "react";

interface AutoFillSuggestionsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
}

const AutoFillSuggestions = ({ data, updateData, currentStep }: AutoFillSuggestionsProps) => {
  const { t } = useTranslation();
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  const showSuggestions = currentStep === 5 || currentStep === 6;

  const handleApplyAsAuthorizedPerson = () => {
    updateData({
      authorizedPersons: [{
        id: Date.now().toString(),
        firstName: data.contactInfo.firstName,
        lastName: data.contactInfo.lastName,
        email: data.contactInfo.email,
        phone: data.contactInfo.phone,
        phonePrefix: data.contactInfo.phonePrefix || '+421',
        maidenName: '',
        birthDate: '',
        birthPlace: '',
        birthNumber: '',
        permanentAddress: '',
        position: '',
        documentType: 'OP',
        documentNumber: '',
        documentValidity: '',
        documentIssuer: '',
        documentCountry: 'Slovensko',
        citizenship: 'Slovensko',
        isPoliticallyExposed: false,
        isUSCitizen: false,
        documentFrontUrl: '',
        documentBackUrl: ''
      }, ...data.authorizedPersons]
    });
    setAppliedSuggestions(prev => new Set(prev).add('authorized'));
  };

  const handleApplyAsActualOwner = () => {
    updateData({
      actualOwners: [{
        id: Date.now().toString(),
        firstName: data.contactInfo.firstName,
        lastName: data.contactInfo.lastName,
        maidenName: '',
        birthDate: '',
        birthPlace: '',
        birthNumber: '',
        citizenship: 'Slovensko',
        permanentAddress: '',
        isPoliticallyExposed: false
      }, ...data.actualOwners]
    });
    setAppliedSuggestions(prev => new Set(prev).add('owner'));
  };

  if (!showSuggestions) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
        <User className="h-4 w-4" />
        {t('ui.autoFill.suggestions')}
      </h4>
      
      <div className="space-y-2">
        {/* Contact Person Suggestion */}
        {currentStep === 5 && data.contactInfo.firstName && data.contactInfo.lastName && (
          <div className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {t('ui.autoFill.contactPerson')}: {data.contactInfo.firstName} {data.contactInfo.lastName}
              </p>
              <p className="text-xs text-slate-500">{data.contactInfo.email}</p>
            </div>
            <div className="flex gap-2">
              {!appliedSuggestions.has('authorized') ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyAsAuthorizedPerson}
                  className="text-xs"
                >
                  {t('ui.autoFill.useAsAuthorizedPerson')}
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  {t('ui.autoFill.applied')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actual Owner Suggestion */}
        {currentStep === 6 && data.contactInfo.firstName && data.contactInfo.lastName && (
          <div className="flex items-center justify-between p-3 bg-white border border-blue-200 rounded">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {t('ui.autoFill.contactPerson')}: {data.contactInfo.firstName} {data.contactInfo.lastName}
              </p>
              <p className="text-xs text-slate-500">{data.contactInfo.email}</p>
            </div>
            <div className="flex gap-2">
              {!appliedSuggestions.has('owner') ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyAsActualOwner}
                  className="text-xs"
                >
                  {t('ui.autoFill.useAsActualOwner')}
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  {t('ui.autoFill.applied')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoFillSuggestions;
