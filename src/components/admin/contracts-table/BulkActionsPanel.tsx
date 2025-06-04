
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Trash2, RefreshCw, UserCheck } from "lucide-react";
import { useBulkContractActions } from "@/hooks/useBulkContractActions";

interface BulkActionsPanelProps {
  selectedCount: number;
  selectedIds: string[];
  onClose: () => void;
}

const BulkActionsPanel = ({ selectedCount, selectedIds, onClose }: BulkActionsPanelProps) => {
  const [contractType, setContractType] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { bulkUpdateType, bulkUpdateSalesperson, bulkDelete, isLoading } = useBulkContractActions();

  const handleUpdateType = () => {
    if (contractType && selectedIds.length > 0) {
      bulkUpdateType.mutate(
        { contractIds: selectedIds, contractType },
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleUpdateSalesperson = () => {
    if (salesperson && selectedIds.length > 0) {
      bulkUpdateSalesperson.mutate(
        { contractIds: selectedIds, salesperson },
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleDelete = () => {
    if (selectedIds.length > 0) {
      bulkDelete.mutate(selectedIds, { onSuccess: () => onClose() });
      setShowDeleteConfirm(false);
    }
  };

  if (showDeleteConfirm) {
    return (
      <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-white shadow-lg border border-red-200">
        <div className="flex items-center space-x-4">
          <div className="text-red-600">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              Naozaj chcete vymazať {selectedCount} označených zmlúv?
            </p>
            <p className="text-sm text-slate-600">Táto akcia je nevratná.</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isLoading}
            >
              Zrušiť
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Vymazať"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-white shadow-lg border border-emerald-200">
      <div className="flex items-center space-x-4">
        <div className="text-emerald-600">
          <UserCheck className="h-5 w-5" />
        </div>
        <div className="text-sm font-medium text-slate-900">
          {selectedCount} zmlúv označených
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Typ zmluvy" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="POS">POS</SelectItem>
              <SelectItem value="SoftPOS">SoftPOS</SelectItem>
              <SelectItem value="POS + SoftPOS">POS + SoftPOS</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleUpdateType}
            disabled={!contractType || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Zmeniť typ
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select value={salesperson} onValueChange={setSalesperson}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Obchodník" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Sales Manager">Sales Manager</SelectItem>
              <SelectItem value="Account Manager">Account Manager</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleUpdateSalesperson}
            disabled={!salesperson || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Zmeniť obchodníka
          </Button>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Vymazať
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default BulkActionsPanel;
