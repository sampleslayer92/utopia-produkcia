
import OnboardingTextarea from "../ui/OnboardingTextarea";
import OnboardingSection from "../ui/OnboardingSection";
import OnboardingSelect from "../ui/OnboardingSelect";
import PersonInputGroup from "../ui/PersonInputGroup";
import { getPersonDataFromContactInfo } from "../utils/autoFillUtils";
import { OnboardingData } from "@/types/onboarding";
import { Building, UserCheck } from "lucide-react";

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
  const roleOptions = [
    { value: 'Konateľ', label: 'Konateľ' },
    { value: 'Majiteľ', label: 'Majiteľ' },
    { value: 'Menežér', label: 'Menežér' }
  ];

  const companyTypeOptions = [
    { value: 'Živnosť', label: 'Živnosť' },
    { value: 'S.r.o.', label: 'S.r.o.' },
    { value: 'Nezisková organizácia', label: 'Nezisková organizácia' },
    { value: 'Akciová spoločnosť', label: 'Akciová spoločnosť' }
  ];

  return (
    <div className="col-span-1 md:col-span-2 p-6 md:p-8">
      <OnboardingSection>
        {/* Role Selection */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-slate-700">
            <UserCheck className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Vaša pozícia v spoločnosti *</span>
          </div>
          <OnboardingSelect
            placeholder="Vyberte svoju rolu"
            value={data.contactInfo.userRole || ''}
            onValueChange={(value) => onContactInfoUpdate('userRole', value)}
            options={roleOptions}
            isCompleted={completedFields.has('userRole')}
          />
          {data.contactInfo.userRole && (
            <div className="text-xs text-slate-600 bg-blue-50 p-2 rounded-md">
              {data.contactInfo.userRole === 'Konateľ' && 
                'Vaše údaje sa automaticky vyplnia vo všetkých potrebných sekciách.'
              }
              {data.contactInfo.userRole === 'Majiteľ' && 
                'Vaše údaje sa automaticky vyplnia okrem sekcie oprávnených osôb.'
              }
              {data.contactInfo.userRole === 'Menežér' && 
                'Vaše údaje sa automaticky vyplnia iba ako kontaktná osoba spoločnosti a prevádzok.'
              }
            </div>
          )}
        </div>

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
