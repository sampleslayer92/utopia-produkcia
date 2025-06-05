
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import ContactInfoSidebar from "./ContactInfoStep/ContactInfoSidebar";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import { useContactInfoSimplified } from "./ContactInfoStep/hooks/useContactInfoSimplified";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const {
    completedFields,
    isBasicInfoComplete,
    updateContactInfo,
    handlePersonDataUpdate
  } = useContactInfoSimplified(data, updateData);

  // Auto-fill status for sidebar
  const autoFillStatus = {
    actualOwners: isBasicInfoComplete,
    authorizedPersons: isBasicInfoComplete,
    businessLocations: isBasicInfoComplete,
    companyInfo: isBasicInfoComplete
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ContactInfoSidebar
            hasAutoFilled={isBasicInfoComplete}
            userRoles={[]} // Simplified - no roles needed
            autoFillStatus={autoFillStatus}
            isBasicInfoComplete={isBasicInfoComplete}
            contractId={data.contractId}
            contractNumber={data.contractNumber}
          />
          
          <ContactInfoForm
            data={data}
            completedFields={completedFields}
            onPersonDataUpdate={handlePersonDataUpdate}
            onContactInfoUpdate={updateContactInfo}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
