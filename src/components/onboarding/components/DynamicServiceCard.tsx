
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ServiceCard } from "@/types/onboarding";

interface DynamicServiceCardProps {
  service: ServiceCard;
  onUpdate: (service: ServiceCard) => void;
  onRemove: () => void;
}

const DynamicServiceCard = ({ service, onUpdate, onRemove }: DynamicServiceCardProps) => {
  const updateField = (field: keyof ServiceCard, value: any) => {
    onUpdate({ ...service, [field]: value });
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
            <span className="text-xs text-slate-500 text-center">{service.name}</span>
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-900">{service.name}</CardTitle>
            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`count-${service.id}`}>Počet ks</Label>
            <Input
              id={`count-${service.id}`}
              type="number"
              min="1"
              value={service.count}
              onChange={(e) => updateField('count', parseInt(e.target.value) || 1)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`fee-${service.id}`}>Mesačný poplatok (EUR)</Label>
            <Input
              id={`fee-${service.id}`}
              type="number"
              min="0"
              step="0.01"
              value={service.monthlyFee}
              onChange={(e) => updateField('monthlyFee', parseFloat(e.target.value) || 0)}
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          {service.name === 'Iný' && (
            <div className="space-y-2">
              <Label htmlFor={`custom-${service.id}`}>Špecifikácia</Label>
              <Input
                id={`custom-${service.id}`}
                type="text"
                value={service.customValue || ''}
                onChange={(e) => updateField('customValue', e.target.value)}
                className="border-slate-300 focus:border-blue-500"
                placeholder="Opíšte službu"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicServiceCard;
