
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { OnboardingData, OpeningHours } from "@/types/onboarding";
import { useBusinessLocationManager } from "./BusinessLocationStep/BusinessLocationManager";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessLocationFieldRenderer } from "./BusinessLocationStep/BusinessLocationFieldRenderer";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const { t } = useTranslation('forms');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isOpeningHoursModalOpen, setIsOpeningHoursModalOpen] = useState(false);

  const handleOpeningHoursEdit = (locationId: string) => {
    setSelectedLocationId(locationId);
    setIsOpeningHoursModalOpen(true);
  };

  const handleOpeningHoursSave = (locationId: string, openingHours: OpeningHours[]) => {
    // This will be handled by the field renderer
    setIsOpeningHoursModalOpen(false);
    setSelectedLocationId(null);
  };

  return (
    <BusinessLocationFieldRenderer
      data={data}
      updateData={updateData}
      selectedLocationId={selectedLocationId}
      isOpeningHoursModalOpen={isOpeningHoursModalOpen}
      onOpeningHoursEdit={handleOpeningHoursEdit}
      onOpeningHoursSave={handleOpeningHoursSave}
    />
  );
};

export default BusinessLocationStep;
