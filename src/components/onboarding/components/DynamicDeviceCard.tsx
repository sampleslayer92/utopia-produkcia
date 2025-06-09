
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DeviceCard } from "@/types/onboarding";
import { useCardCalculations } from "../hooks/useCardCalculations";
import CardHeaderComponent from "./shared/CardHeader";
import CardInputFields from "./shared/CardInputFields";
import AddonsSection from "./shared/AddonsSection";
import CostSummary from "./shared/CostSummary";

interface DynamicDeviceCardProps {
  device: DeviceCard;
  onUpdate: (device: DeviceCard) => void;
  onRemove: () => void;
  onEdit?: () => void;
}

const DynamicDeviceCard = ({ device, onUpdate, onRemove, onEdit }: DynamicDeviceCardProps) => {
  const { mainSubtotal, addonsSubtotal, totalSubtotal } = useCardCalculations(device);

  const updateField = (field: keyof DeviceCard, value: any) => {
    onUpdate({ ...device, [field]: value });
  };

  return (
    <Card className="border-slate-200/60 bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="relative pb-3">
        <CardHeaderComponent card={device} onEdit={onEdit} onRemove={onRemove} />
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <CardInputFields card={device} onUpdate={updateField} />
        <AddonsSection addons={device.addons || []} deviceCount={device.count} />
        <CostSummary 
          mainSubtotal={mainSubtotal}
          addonsSubtotal={addonsSubtotal}
          totalSubtotal={totalSubtotal}
        />
      </CardContent>
    </Card>
  );
};

export default DynamicDeviceCard;
