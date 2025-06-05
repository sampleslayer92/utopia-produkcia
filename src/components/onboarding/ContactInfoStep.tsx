
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import ContactInfoSidebar from "./ContactInfoStep/ContactInfoSidebar";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import { useContactInfoLogic } from "./ContactInfoStep/hooks/useContactInfoLogic";

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
    autoFillStatus,
    updateContactInfo,
    handlePersonDataUpdate,
    handleRolesChange,
    isBasicInfoComplete
  } = useContactInfoLogic(data, updateData);

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ContactInfoSidebar
            hasAutoFilled={hasAutoFilled}
            userRoles={data.contactInfo.userRoles || []}
            autoFillStatus={autoFillStatus}
            isBasicInfoComplete={isBasicInfoComplete()}
            contractId={data.contractId}
            contractNumber={data.contractNumber}
          />
          
          <ContactInfoForm
            data={data}
            completedFields={completedFields}
            onPersonDataUpdate={handlePersonDataUpdate}
            onRolesChange={handleRolesChange}
            onContactInfoUpdate={updateContactInfo}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
