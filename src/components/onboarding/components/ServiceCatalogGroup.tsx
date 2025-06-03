
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ServiceCatalogGroupProps {
  services: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  onAddService: (service: any) => void;
}

const ServiceCatalogGroup = ({ services, onAddService }: ServiceCatalogGroupProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
        >
          <div className="flex-1">
            <h4 className="font-medium text-slate-900">{service.name}</h4>
            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddService(service)}
            className="ml-3 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Pridať
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ServiceCatalogGroup;
