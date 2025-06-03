
import { Button } from "@/components/ui/button";
import { BusinessLocation } from "@/types/onboarding";
import { Store, Edit } from "lucide-react";

interface BusinessLocationSummaryProps {
  location: BusinessLocation;
  onEdit: (location: BusinessLocation) => void;
}

const BusinessLocationSummary = ({ location, onEdit }: BusinessLocationSummaryProps) => {
  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-900 flex items-center gap-2">
          <Store className="h-4 w-4 text-green-600" />
          {location.name}
        </h4>
        <Button
          onClick={() => onEdit(location)}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Edit className="h-3 w-3" />
          Upraviť
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Adresa:</span> {location.address.street}, {location.address.city}
        </div>
        <div>
          <span className="font-medium">Kontakt:</span> {location.contactPerson.name}
        </div>
        <div>
          <span className="font-medium">Sektor:</span> {location.businessSector}
        </div>
        <div>
          <span className="font-medium">POS:</span> {location.hasPOS ? 'Áno' : 'Nie'}
        </div>
      </div>
    </div>
  );
};

export default BusinessLocationSummary;
