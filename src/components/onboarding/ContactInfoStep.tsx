
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import ContactInfoSidebar from "./ContactInfoStep/ContactInfoSidebar";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useSimplifiedContactInfoLogic } from "./ContactInfoStep/hooks/useSimplifiedContactInfoLogic";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData }: ContactInfoStepProps) => {
  const isMobile = useIsMobile();
  const {
    completedFields,
    hasAutoFilled,
    updateContactInfo,
    handlePersonDataUpdate,
    isBasicInfoComplete
  } = useSimplifiedContactInfoLogic(data, updateData);

  // Auto-fill status based only on basic info completion
  const basicInfoComplete = Boolean(isBasicInfoComplete());
  
  const autoFillStatus = {
    actualOwners: basicInfoComplete,
    authorizedPersons: basicInfoComplete,
    businessLocations: basicInfoComplete,
    companyInfo: basicInfoComplete
  };

  const infoTooltipData = {
    description: "Vyplňte vaše základné kontaktné údaje. Tieto informácie sa použijú pre automatické predvyplnenie ostatných krokov registrácie.",
    features: [
      "Automatické predvyplnenie kontaktných osôb",
      "Synchronizácia údajov medzi krokmi",
      "Overenie emailovej adresy", 
      "Formátovanie telefónneho čísla"
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title="Kontaktné údaje"
        icon={<User className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <ContactInfoForm
          data={data}
          completedFields={completedFields}
          onPersonDataUpdate={handlePersonDataUpdate}
          onContactInfoUpdate={updateContactInfo}
        />
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ContactInfoSidebar
            hasAutoFilled={hasAutoFilled}
            userRoles={[]} // No longer using roles array
            autoFillStatus={autoFillStatus}
            isBasicInfoComplete={basicInfoComplete}
            contractId={data.contractId || ''}
            contractNumber={data.contractNumber || ''}
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
