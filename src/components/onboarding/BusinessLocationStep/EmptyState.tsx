
import { Store, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddLocation: () => void;
}

const EmptyState = ({ onAddLocation }: EmptyStateProps) => {
  return (
    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
      <Store className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-700 mb-2">Zatiaľ žiadne prevádzky</h3>
      <p className="text-sm text-slate-500 mb-6">Pridajte svoju prvú prevádzkovou lokalitu</p>
      <Button 
        onClick={onAddLocation}
        variant="outline" 
        className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Pridať prevádzku
      </Button>
    </div>
  );
};

export default EmptyState;
