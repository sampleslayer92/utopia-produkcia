
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeviceCatalogCardProps {
  device: {
    id: string;
    name: string;
    description: string;
    image?: string;
    specifications: string[];
    monthlyFee: number;
    purchasePrice?: number;
    rentalPrice?: number;
  };
  onAdd: () => void;
}

const DeviceCatalogCard = ({ device, onAdd }: DeviceCatalogCardProps) => {
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <Card className="border-slate-200 hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Device Image */}
          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {device.image ? (
              <img 
                src={device.image} 
                alt={device.name} 
                className="w-16 h-16 object-contain hover:scale-110 transition-transform cursor-pointer" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-xs text-slate-500 text-center ${device.image ? 'hidden' : ''}`}>
              {device.name}
            </span>
          </div>

          {/* Device Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-slate-900 truncate">{device.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{device.description}</p>
              </div>
              <Button
                onClick={onAdd}
                size="sm"
                className="ml-2 bg-blue-600 hover:bg-blue-700 shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Pridať
              </Button>
            </div>

            {/* Pricing */}
            <div className="flex items-center gap-4 mb-3">
              {device.rentalPrice && (
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                    {device.rentalPrice} €/mes
                  </Badge>
                  <span className="text-xs text-slate-500">prenájom</span>
                </div>
              )}
              {device.purchasePrice && (
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    {device.purchasePrice} €
                  </Badge>
                  <span className="text-xs text-slate-500">kúpa</span>
                </div>
              )}
            </div>

            {/* Specifications Collapsible */}
            {device.specifications.length > 0 && (
              <Collapsible open={isSpecsOpen} onOpenChange={setIsSpecsOpen}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-blue-600 hover:text-blue-800 hover:bg-transparent"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    <span className="text-xs">Špecifikácie</span>
                    {isSpecsOpen ? (
                      <ChevronUp className="h-3 w-3 ml-1" />
                    ) : (
                      <ChevronDown className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="bg-slate-50 rounded-md p-3 space-y-1">
                    {device.specifications.map((spec, index) => (
                      <p key={index} className="text-xs text-slate-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {spec}
                      </p>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCatalogCard;
