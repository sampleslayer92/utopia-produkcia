
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import ContactInfoForm from "./ContactInfoStep/ContactInfoForm";
import InfoBanner from "./ui/InfoBanner";
import InfoModal from "./ui/InfoModal";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useSimplifiedContactInfoLogic } from "./ContactInfoStep/hooks/useSimplifiedContactInfoLogic";
import { useContactInfoSync } from "./ContactInfoStep/hooks/useContactInfoSync";
import { useIsMobile } from "@/hooks/use-mobile";

interface ContactInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ContactInfoStep = ({ data, updateData, onNext }: ContactInfoStepProps) => {
  const { t } = useTranslation(['forms', 'help']);
  const isMobile = useIsMobile();
  const [showInfoModal, setShowInfoModal] = useState(false);
  
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

  const keyPoints = [
    "Auto-vyplnenie pre ďalšie kroky",
    "Bezpečné uloženie údajov",
    "Validácia formulárov"
  ];

  const infoModalData = {
    title: t('forms:contactInfo.title'),
    description: t('forms:contactInfo.description'),
    features: t('forms:contactInfo.features', { returnObjects: true }) as string[],
    tips: [
      "Po zadaní základných údajov sa automaticky vyplnia údaje v ďalších krokoch",
      "Všetky údaje sú bezpečne uložené a synchronizované",
      "Môžete kedykoľvek upraviť zadané informácie"
    ],
    helpInfo: [
      "Email musí byť platný a jedinečný",
      "Telefónne číslo sa automaticky validuje",
      "Meno a priezvisko sú povinné polia"
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('forms:contactInfo.title')}
        icon={<User className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoModalData}
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
    <div className="space-y-6">
      <InfoBanner
        title={t('forms:contactInfo.title')}
        keyPoints={keyPoints}
        onShowDetails={() => setShowInfoModal(true)}
      />
      
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6">
          <ContactInfoForm
            data={data}
            completedFields={completedFields}
            onPersonDataUpdate={handlePersonDataUpdate}
            onContactInfoUpdate={updateContactInfo}
          />
        </CardContent>
      </Card>

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalData.title}
        description={infoModalData.description}
        features={infoModalData.features}
        tips={infoModalData.tips}
        helpInfo={infoModalData.helpInfo}
      />
    </div>
  );
};

export default ContactInfoStep;
