
import { Card, CardContent } from "@/components/ui/card";
import { Store } from "lucide-react";
import { useTranslation } from "react-i18next";
import BusinessLocationSidebar from "./BusinessLocationStep/BusinessLocationSidebar";
import BusinessLocationCard from "./BusinessLocationStep/BusinessLocationCard";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import EmptyState from "./BusinessLocationStep/EmptyState";
import OpeningHoursModal from "./BusinessLocationStep/OpeningHoursModal";
import { OnboardingData, OpeningHours } from "@/types/onboarding";
import { useBusinessLocationManager } from "./BusinessLocationStep/BusinessLocationManager";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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

  const handleOpeningHoursEdit = (locationId: string) => {
    setSelectedLocationId(locationId);
    setIsOpeningHoursModalOpen(true);
  };

  const handleOpeningHoursSave = (openingHours: OpeningHours[]) => {
    if (selectedLocationId) {
      updateOpeningHours(selectedLocationId, openingHours);
    }
    setIsOpeningHoursModalOpen(false);
    setSelectedLocationId(null);
  };

  const infoTooltipData = {
    description: t('businessLocation.description'),
    features: t('businessLocation.sidebar.features', { returnObjects: true }) as string[]
  };

  const renderContent = () => {
    if (data.businessLocations.length === 0) {
      return <EmptyState onAddLocation={addBusinessLocation} />;
    }

    return (
      <div className="space-y-4">
        {data.businessLocations.map((location, index) => (
          <BusinessLocationCard
            key={location.id}
            location={location}
            index={index}
            data={data}
            isExpanded={expandedLocationId === location.id}
            onToggle={() => toggleLocation(location.id)}
            onRemove={() => removeBusinessLocation(location.id)}
            onUpdate={(field, value) => updateBusinessLocation(location.id, field, value)}
            onBankAccountsUpdate={(accounts) => updateBankAccounts(location.id, accounts)}
            onBusinessDetailsUpdate={(field, value) => updateBusinessDetails(location.id, field, value)}
            onOpeningHoursEdit={() => handleOpeningHoursEdit(location.id)}
          />
        ))}
      </div>
    );
  };

  if (isMobile) {
    return (
      <>
        <MobileOptimizedCard
          title={t('businessLocation.title')}
          icon={<Store className="h-4 w-4 text-blue-600" />}
          infoTooltip={infoTooltipData}
        >
          {renderContent()}
        </MobileOptimizedCard>

        <OpeningHoursModal
          isOpen={isOpeningHoursModalOpen}
          onClose={() => setIsOpeningHoursModalOpen(false)}
          onSave={handleOpeningHoursSave}
          initialHours={
            selectedLocationId 
              ? data.businessLocations.find(loc => loc.id === selectedLocationId)?.openingHoursDetailed || []
              : []
          }
        />
      </>
    );
  }

  return (
    <>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <BusinessLocationSidebar
              hasBusinessContactRole={hasBusinessContactRole}
              userRole={data.contactInfo.userRole}
              onAddLocation={addBusinessLocation}
            />
            
            <div className="col-span-1 md:col-span-2 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </CardContent>
      </Card>

      <OpeningHoursModal
        isOpen={isOpeningHoursModalOpen}
        onClose={() => setIsOpeningHoursModalOpen(false)}
        onSave={handleOpeningHoursSave}
        initialHours={
          selectedLocationId 
            ? data.businessLocations.find(loc => loc.id === selectedLocationId)?.openingHoursDetailed || []
            : []
        }
      />
    </>
  );
};

export default BusinessLocationStep;
