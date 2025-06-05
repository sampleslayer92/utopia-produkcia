
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import OnboardingSection from "./ui/OnboardingSection";
import BusinessLocationCard from "./BusinessLocationStep/BusinessLocationCard";
import EmptyState from "./BusinessLocationStep/EmptyState";
import BusinessLocationSidebar from "./BusinessLocationStep/BusinessLocationSidebar";
import OpeningHoursModal from "./BusinessLocationStep/OpeningHoursModal";
import { useBusinessLocationManager } from "./BusinessLocationStep/BusinessLocationManager";
import { useState } from "react";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const [editingHoursLocationId, setEditingHoursLocationId] = useState<string | null>(null);

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

  const getUserRole = () => {
    if (data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku')) {
      return 'Kontaktná osoba na prevádzku';
    }
    if (data.contactInfo.userRoles?.includes('Majiteľ')) {
      return 'Majiteľ';
    }
    return '';
  };

  return (
    <>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <BusinessLocationSidebar
              hasBusinessContactRole={hasBusinessContactRole}
              userRole={getUserRole()}
              onAddLocation={addBusinessLocation}
            />
            
            <div className="col-span-1 md:col-span-2 p-6 md:p-8">
              <OnboardingSection>
                {data.businessLocations.length === 0 ? (
                  <EmptyState onAddLocation={addBusinessLocation} />
                ) : (
                  <>
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
                        onOpeningHoursEdit={() => setEditingHoursLocationId(location.id)}
                      />
                    ))}

                    <Button
                      onClick={addBusinessLocation}
                      variant="outline"
                      className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 mt-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Pridať ďalšiu prevádzku
                    </Button>
                  </>
                )}
              </OnboardingSection>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours Modal */}
      {editingHoursLocationId && (
        <OpeningHoursModal
          isOpen={true}
          onClose={() => setEditingHoursLocationId(null)}
          openingHours={data.businessLocations.find(loc => loc.id === editingHoursLocationId)?.openingHoursDetailed || []}
          onSave={(hours) => {
            updateOpeningHours(editingHoursLocationId, hours);
            setEditingHoursLocationId(null);
          }}
        />
      )}
    </>
  );
};

export default BusinessLocationStep;
