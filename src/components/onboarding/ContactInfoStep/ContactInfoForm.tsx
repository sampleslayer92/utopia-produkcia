
import { Building } from "lucide-react";
import OnboardingTextarea from "../ui/OnboardingTextarea";
import OnboardingSection from "../ui/OnboardingSection";
import OnboardingSelect from "../ui/OnboardingSelect";
import MultiRoleSelector from "../ui/MultiRoleSelector";
import PersonInputGroup from "../ui/PersonInputGroup";
import { getPersonDataFromContactInfo } from "../utils/autoFillUtils";
import { OnboardingData } from "@/types/onboarding";

interface ContactInfoFormProps {
  data: OnboardingData;
  completedFields: Set<string>;
  onPersonDataUpdate: (field: string, value: string) => void;
  onRolesChange: (roles: string[]) => void;
  onContactInfoUpdate: (field: string, value: string) => void;
}

const ContactInfoForm = ({
  data,
  completedFields,
  onPersonDataUpdate,
  onRolesChange,
  onContactInfoUpdate
}: ContactInfoFormProps) => {
  const companyTypeOptions = [
    { value: 'Živnosť', label: 'Živnosť' },
    { value: 'S.r.o.', label: 'S.r.o.' },
    { value: 'Nezisková organizácia', label: 'Nezisková organizácia' },
    { value: 'Akciová spoločnosť', label: 'Akciová spoločnosť' }
  ];

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

        {/* Company Type Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Building className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Typ spoločnosti *</span>
          </div>
          <OnboardingSelect
            placeholder="Vyberte typ spoločnosti"
            value={data.contactInfo.companyType || ''}
            onValueChange={(value) => onContactInfoUpdate('companyType', value)}
            options={companyTypeOptions}
            isCompleted={completedFields.has('companyType')}
          />
        </div>

        {/* Multi-Role Selection */}
        <MultiRoleSelector
          selectedRoles={data.contactInfo.userRoles || []}
          onChange={onRolesChange}
        />

        {/* Optional Note Section */}
        <OnboardingTextarea
          label="Chcete nám niečo odkázať?"
          value={data.contactInfo.salesNote || ''}
          onChange={(e) => onContactInfoUpdate('salesNote', e.target.value)}
          placeholder="Napríklad: Najlepší čas na kontakt, preferovaný spôsob komunikácie..."
          rows={4}
        />
      </OnboardingSection>
    </div>
  );
};

export default ContactInfoForm;
