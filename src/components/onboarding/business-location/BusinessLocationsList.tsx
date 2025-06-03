import { Button } from "@/components/ui/button";
import { BusinessLocation } from "@/types/onboarding";
import { Store, Plus } from "lucide-react";
import BusinessLocationSummary from "./BusinessLocationSummary";
import BusinessLocationForm from "./BusinessLocationForm";

interface BusinessLocationsListProps {
  locations: BusinessLocation[];
  editingLocation: BusinessLocation | null;
  isNew: boolean;
  onAddNew: () => void;
  onEdit: (location: BusinessLocation) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (locationId: string) => void;
  onFieldChange: (field: string, value: any) => void;
}

const BusinessLocationsList = ({
  locations,
  editingLocation,
  isNew,
  onAddNew,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onFieldChange
}: BusinessLocationsListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">
          Prevádzkové lokality ({locations.length})
        </h3>
        <Button 
          onClick={onAddNew} 
          className="flex items-center gap-2"
          disabled={editingLocation !== null}
        >
          <Plus className="h-4 w-4" />
          Pridať prevádzku
        </Button>
      </div>

      {/* Editing Form */}
      {editingLocation && (
        <BusinessLocationForm
          location={editingLocation}
          isEditing={true}
          isNew={isNew}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onFieldChange={onFieldChange}
        />
      )}

      {/* Existing Locations */}
      {locations.length > 0 && !editingLocation && (
        <div className="space-y-4">
          {locations.map((location) => (
            <BusinessLocationSummary
              key={location.id}
              location={location}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {locations.length === 0 && !editingLocation && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Žiadne prevádzky</h3>
          <p className="text-slate-600 mb-6">Pridajte svoju prvú prevádzkovou lokalitu</p>
          <Button onClick={onAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Pridať prevádzku
          </Button>
        </div>
      )}
    </div>
  );
};

export default BusinessLocationsList;
