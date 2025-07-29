
import { useTranslation } from "react-i18next";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import OnboardingSection from "../ui/OnboardingSection";
import PersonInputGroup from "../ui/PersonInputGroup";
import { getPersonDataFromContactInfo } from "../utils/autoFillUtils";
import { OnboardingData } from "@/types/onboarding";

interface ContactInfoFormProps {
  data: OnboardingData;
  completedFields: Set<string>;
  onPersonDataUpdate: (field: string, value: string) => void;
  onContactInfoUpdate: (field: string, value: string) => void;
  customFields?: Array<{
    id?: string;
    fieldKey: string;
    fieldLabel: string;
    fieldType: string;
    isRequired: boolean;
    isEnabled: boolean;
    position?: number;
    fieldOptions?: any;
  }>;
}

const ContactInfoForm = ({
  data,
  completedFields,
  onPersonDataUpdate,
  onContactInfoUpdate,
  customFields
}: ContactInfoFormProps) => {
  const { t } = useTranslation('forms');

  // Check if field is enabled in customFields configuration
  const isFieldEnabled = (fieldKey: string) => {
    if (!customFields) return true; // Default to enabled if no custom config
    const field = customFields.find(f => f.fieldKey === fieldKey);
    return field ? field.isEnabled : false;
  };

  // Check if sales note should be shown
  const showSalesNote = isFieldEnabled('salesNote');

  console.log('ContactInfoForm debug:', {
    customFields: customFields?.length || 0,
    enabledFields: customFields?.filter(f => f.isEnabled).length || 0,
    showSalesNote,
    fieldsConfig: customFields?.map(f => ({ key: f.fieldKey, enabled: f.isEnabled }))
  });

  return (
    <div className="col-span-1 md:col-span-2 p-6 md:p-8">
      <OnboardingSection>
        {/* Personal Information using unified component */}
        <PersonInputGroup
          data={getPersonDataFromContactInfo(data.contactInfo)}
          onUpdate={onPersonDataUpdate}
          completedFields={completedFields}
          forceShowPhonePrefix={true}
          customFields={customFields}
        />

        {/* Optional Note Section - only show if enabled */}
        {showSalesNote && (
          <OnboardingTextarea
            label={t('contactInfo.salesNote')}
            value={data.contactInfo.salesNote || ''}
            onChange={(e) => onContactInfoUpdate('salesNote', e.target.value)}
            placeholder={t('contactInfo.placeholders.salesNote')}
            rows={4}
          />
        )}
      </OnboardingSection>
    </div>
  );
};

export default ContactInfoForm;
