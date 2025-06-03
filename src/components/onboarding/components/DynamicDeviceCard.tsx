
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DeviceCard } from "@/types/onboarding";

interface DynamicDeviceCardProps {
  device: DeviceCard;
  onUpdate: (device: DeviceCard) => void;
  onRemove: () => void;
}

const DynamicDeviceCard = ({ device, onUpdate, onRemove }: DynamicDeviceCardProps) => {
  const updateField = (field: keyof DeviceCard, value: any) => {
    onUpdate({ ...device, [field]: value });
  };

  return (
    <Card className="border-slate-200/60 bg-white shadow-md">
      <CardHeader className="relative pb-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="absolute top-2 right-2 h-8 w-8 hover:bg-red-50 hover:border-red-300"
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
            {device.image ? (
              <img src={device.image} alt={device.name} className="w-16 h-16 object-contain" />
            ) : (
              <span className="text-xs text-slate-500">{device.name}</span>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900">{device.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{device.description}</p>
            {device.specifications.length > 0 && (
              <div className="mt-2">
                {device.specifications.map((spec, index) => (
                  <p key={index} className="text-xs text-slate-500">• {spec}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`count-${device.id}`}>Počet ks</Label>
            <Input
              id={`count-${device.id}`}
              type="number"
              min="1"
              value={device.count}
              onChange={(e) => updateField('count', parseInt(e.target.value) || 1)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`fee-${device.id}`}>Mesačný poplatok (EUR)</Label>
            <Input
              id={`fee-${device.id}`}
              type="number"
              min="0"
              step="0.01"
              value={device.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          {device.simCards !== undefined && (
            <div className="space-y-2">
              <Label htmlFor={`sim-${device.id}`}>SIM karty</Label>
              <Input
                id={`sim-${device.id}`}
                type="number"
                min="0"
                value={device.simCards}
                onChange={(e) => updateField('simCards', parseInt(e.target.value) || 0)}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicDeviceCard;
