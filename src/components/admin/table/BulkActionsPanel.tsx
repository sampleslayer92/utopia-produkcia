
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BulkDeleteModal from "./BulkDeleteModal";
import { useContractTypeOptions, useSalesPersonOptions } from "@/hooks/useEnhancedContractsData";

interface BulkActionsPanelProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkUpdate: (field: string, value: string) => void;
  onBulkDelete: () => void;
  isLoading?: boolean;
}

const BulkActionsPanel = ({
  selectedCount,
  onClearSelection,
  onBulkUpdate,
  onBulkDelete,
  isLoading = false
}: BulkActionsPanelProps) => {
  const [contractType, setContractType] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();

  const handleTypeUpdate = () => {
    if (contractType) {
      onBulkUpdate('contractType', contractType);
      setContractType('');
    }
  };

  const handleSalesPersonUpdate = () => {
    if (salesPerson) {
      onBulkUpdate('salesPerson', salesPerson);
      setSalesPerson('');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onBulkDelete();
    setShowDeleteModal(false);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {selectedCount} {selectedCount === 1 ? 'zmluva označená' : selectedCount < 5 ? 'zmluvy označené' : 'zmlúv označených'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Zmeniť typ zmluvy */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Typ zmluvy</label>
            <div className="flex space-x-2">
              <Select value={contractType} onValueChange={setContractType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Vybrať typ" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {contractTypes?.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleTypeUpdate}
                disabled={!contractType || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Zmeniť obchodníka */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Obchodník</label>
            <div className="flex space-x-2">
              <Select value={salesPerson} onValueChange={setSalesPerson}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Vybrať obchodníka" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {salesPersons?.map(person => (
                    <SelectItem key={person} value={person}>{person}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleSalesPersonUpdate}
                disabled={!salesPerson || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Vymazať */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Akcie</label>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vymazať označené
            </Button>
          </div>
        </div>
      </div>

      <BulkDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        selectedCount={selectedCount}
      />
    </>
  );
};

export default BulkActionsPanel;
