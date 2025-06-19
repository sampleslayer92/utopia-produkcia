
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";
import { Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useBusinessLocationManager } from "./BusinessLocationStep/BusinessLocationManager";
import InfoBanner from "./ui/InfoBanner";
import InfoModal from "./ui/InfoModal";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const { t } = useTranslation('forms');
  const isMobile = useIsMobile();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Use the hook from BusinessLocationManager
  const {
    expandedLocationId,
    hasBusinessContactRole,
    addBusinessLocation,
    removeBusinessLocation,
    updateBusinessLocation,
    updateBankAccounts,
    updateBusinessDetails,
    updateOpeningHours,
    toggleLocation
  } = useBusinessLocationManager(data, updateData);

  const keyPoints = [
    "Registrácia prevádzkových miest",
    "Auto-vyplnenie zo sídla spoločnosti", 
    "Bankovej účty a otváracie hodiny"
  ];

  const infoModalData = {
    title: t('businessLocation.sidebar.title'),
    description: t('businessLocation.sidebar.description'),
    features: t('businessLocation.sidebar.features', { returnObjects: true }) as string[],
    tips: [
      "Pri zaškrtnutí 'Sídlo = prevádzka' sa automaticky vytvorí prevádzka s adresou sídla",
      "Každá prevádzka musí mať aspoň jeden bankový účet",
      "Otváracie hodiny môžete nastaviť pre každý deň zvlášť"
    ],
    helpInfo: [
      "MCC kód určuje typ podnikania",
      "Odhad obratu pomáha s nastavením limitov",
      "Kontaktná osoba je povinná pre každú prevádzku"
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('businessLocation.sidebar.title')}
        icon={<Store className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoModalData}
      >
        {/* We need to create the actual BusinessLocationManager component content here */}
        <div>Business Location Manager content will go here</div>
      </MobileOptimizedCard>
    );
  }

  return (
    <div className="space-y-6">
      <InfoBanner
        title={t('businessLocation.sidebar.title')}
        keyPoints={keyPoints}
        onShowDetails={() => setShowInfoModal(true)}
      />
      
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6">
          {/* We need to create the actual BusinessLocationManager component content here */}
          <div>Business Location Manager content will go here</div>
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

export default BusinessLocationStep;
