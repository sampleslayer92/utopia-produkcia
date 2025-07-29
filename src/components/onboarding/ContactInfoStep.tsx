
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import ContactInfoSidebar from "./ContactInfoStep/ContactInfoSidebar";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useSimplifiedContactInfoLogic } from "./ContactInfoStep/hooks/useSimplifiedContactInfoLogic";
import { useContactInfoSync } from "./ContactInfoStep/hooks/useContactInfoSync";
import { useIsMobile } from "@/hooks/use-mobile";
import { ContactInfoFieldRenderer } from "./ContactInfoStep/ContactInfoFieldRenderer";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData, onNext }: ContactInfoStepProps) => {
  const { t } = useTranslation(['forms', 'help']);
  const isMobile = useIsMobile();
  
  // Use contact info sync for cross-step synchronization
  const { updateContactInfo, triggerSync } = useContactInfoSync({ data, updateData });
  
  const {
    completedFields,
    hasAutoFilled,
    handlePersonDataUpdate,
    isBasicInfoComplete,
    triggerAutoFill
  } = useSimplifiedContactInfoLogic(data, updateData);

  // Enhanced onNext function that triggers auto-fill and sync
  const handleNext = () => {
    console.log('=== ContactInfoStep handleNext ===', {
      isBasicInfoComplete: isBasicInfoComplete(),
      contactInfo: data.contactInfo
    });
    
    // Trigger auto-fill if basic info is complete
    if (isBasicInfoComplete()) {
      console.log('Triggering auto-fill from ContactInfoStep');
      triggerAutoFill();
    }
    
    // Trigger synchronization
    triggerSync();
    
    // Proceed to next step (this will trigger the auto-fill in OnboardingStepRenderer)
    onNext();
  };

  // Auto-fill status based only on basic info completion
  const basicInfoComplete = Boolean(isBasicInfoComplete());
  
  const autoFillStatus = {
    actualOwners: basicInfoComplete,
    authorizedPersons: basicInfoComplete,
    businessLocations: basicInfoComplete,
    companyInfo: basicInfoComplete
  };

  const infoTooltipData = {
    description: t('forms:contactInfo.description'),
    features: t('forms:contactInfo.features', { returnObjects: true }) as string[]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('forms:contactInfo.title')}
        icon={<User className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <ContactInfoFieldRenderer
          data={data}
          updateData={updateData}
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
          
          <ContactInfoFieldRenderer
            data={data}
            updateData={updateData}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
