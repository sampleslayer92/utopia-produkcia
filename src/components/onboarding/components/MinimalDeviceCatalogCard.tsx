
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface MinimalDeviceCatalogCardProps {
  device: {
    id: string;
    name: string;
    description: string;
    image?: string;
    rentalPrice?: number;
    purchasePrice?: number;
  };
  onAdd: () => void;
}

const MinimalDeviceCatalogCard = ({ device, onAdd }: MinimalDeviceCatalogCardProps) => {
  return (
    <Card className="border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Device Image */}
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {device.image ? (
              <img 
                src={device.image} 
                alt={device.name} 
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
            ) : null}
            <span className={`text-xs text-slate-500 text-center ${device.image ? 'hidden' : ''}`}>
              {device.name.charAt(0)}
            </span>
          </div>

          {/* Device Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate text-sm">{device.name}</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-1">{device.description}</p>
            
            {/* Pricing badges */}
            <div className="flex items-center gap-2 mt-2">
              {device.rentalPrice && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-xs px-1.5 py-0.5">
                  {device.rentalPrice} €/mes
                </Badge>
              )}
              {device.purchasePrice && (
                <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs px-1.5 py-0.5">
                  {device.purchasePrice} €
                </Badge>
              )}
            </div>
          </div>

          {/* Add Button */}
          <Button
            onClick={onAdd}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 shrink-0 text-xs px-3 py-1.5 h-auto"
          >
            <Plus className="h-3 w-3 mr-1" />
            Pridať
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalDeviceCatalogCard;
