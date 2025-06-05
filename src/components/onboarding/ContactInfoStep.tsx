
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import ContactInfoSidebar from "./ContactInfoStep/ContactInfoSidebar";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import { useSimplifiedContactInfoLogic } from "./ContactInfoStep/hooks/useSimplifiedContactInfoLogic";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const {
    completedFields,
    hasAutoFilled,
    updateContactInfo,
    handlePersonDataUpdate,
    isBasicInfoComplete
  } = useSimplifiedContactInfoLogic(data, updateData);

  // Auto-fill status shows all sections as auto-filled when basic info is complete
  const autoFillStatus = {
    actualOwners: Boolean(isBasicInfoComplete()),
    authorizedPersons: Boolean(isBasicInfoComplete()),
    businessLocations: Boolean(isBasicInfoComplete()),
    companyInfo: Boolean(isBasicInfoComplete())
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ContactInfoSidebar
            hasAutoFilled={hasAutoFilled}
            userRoles={[]} // No longer using roles
            autoFillStatus={autoFillStatus}
            isBasicInfoComplete={Boolean(isBasicInfoComplete())}
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
