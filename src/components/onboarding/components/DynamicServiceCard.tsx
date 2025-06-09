
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ServiceCard } from "@/types/onboarding";
import { useCardCalculations } from "../hooks/useCardCalculations";
import CardHeaderComponent from "./shared/CardHeader";
import CardInputFields from "./shared/CardInputFields";
import AddonsSection from "./shared/AddonsSection";
import CostSummary from "./shared/CostSummary";

interface DynamicServiceCardProps {
  service: ServiceCard;
  onUpdate: (service: ServiceCard) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const DynamicServiceCard = ({ service, onUpdate, onRemove, onEdit }: DynamicServiceCardProps) => {
  const { mainSubtotal, addonsSubtotal, totalSubtotal } = useCardCalculations(service);

  const updateField = (field: keyof ServiceCard, value: any) => {
    try {
      console.log(`Updating service field ${field} with value:`, value);
      const updatedService = { ...service, [field]: value };
      onUpdate(updatedService);
    } catch (error) {
      console.error('Error updating service field:', error);
    }
  };

  return (
    <Card className="border-slate-200/60 bg-white shadow-md">
      <CardHeader className="relative pb-3">
        <CardHeaderComponent card={service} onEdit={onEdit} onRemove={onRemove} />
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <CardInputFields card={service} onUpdate={updateField} />
        <AddonsSection addons={service.addons || []} deviceCount={service.count} />
        <CostSummary 
          mainSubtotal={mainSubtotal}
          addonsSubtotal={addonsSubtotal}
          totalSubtotal={totalSubtotal}
        />
      </CardContent>
    </Card>
  );
};

export default DynamicServiceCard;
