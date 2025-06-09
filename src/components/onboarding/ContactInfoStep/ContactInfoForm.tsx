
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
}

const ContactInfoForm = ({
  data,
  completedFields,
  onPersonDataUpdate,
  onContactInfoUpdate
}: ContactInfoFormProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="col-span-1 md:col-span-2 p-6 md:p-8">
      <OnboardingSection>
        {/* Personal Information using unified component */}
        <PersonInputGroup
          data={getPersonDataFromContactInfo(data.contactInfo)}
          onUpdate={onPersonDataUpdate}
          completedFields={completedFields}
          forceShowPhonePrefix={true}
        />

        {/* Optional Note Section */}
        <OnboardingTextarea
          label={t('Chcete nám niečo odkázať?')}
          value={data.contactInfo.salesNote || ''}
          onChange={(e) => onContactInfoUpdate('salesNote', e.target.value)}
          placeholder={t('Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie...')}
          rows={4}
        />
      </OnboardingSection>
    </div>
  );
};

export default ContactInfoForm;
