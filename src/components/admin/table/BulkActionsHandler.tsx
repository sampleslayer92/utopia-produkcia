
import { useTranslation } from 'react-i18next';
import { useBulkContractActions } from "@/hooks/useBulkContractActions";
import { toast } from "sonner";
import { GenericBulkActionsPanel, BulkAction } from "@/components/admin/shared/GenericBulkActionsPanel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Edit } from "lucide-react";
import { useContractTypeOptions, useSalesPersonOptions } from "@/hooks/useEnhancedContractsData";

interface BulkActionsHandlerProps {
  selectedContracts: string[];
  onClearSelection: () => void;
}

const BulkActionsHandler = ({
  selectedContracts,
  onClearSelection
}: BulkActionsHandlerProps) => {
  const { t } = useTranslation('admin');
  const { bulkUpdate, bulkDelete, bulkExport, isUpdating, isDeleting, isExporting, isLoading } = useBulkContractActions();
  const [contractType, setContractType] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const { data: contractTypes } = useContractTypeOptions();
  const { data: salesPersons } = useSalesPersonOptions();

  const handleBulkUpdate = (field: string, value: string) => {
    console.log(`Bulk update: ${field} = ${value} on contracts:`, selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsSelected'));
      return;
    }

    bulkUpdate({ contractIds: selectedContracts, field, value });
    onClearSelection();
    setContractType('');
    setSalesPerson('');
    setShowUpdateForm(false);
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete contracts:', selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsToDelete'));
      return;
    }

    bulkDelete(selectedContracts);
    onClearSelection();
  };

  const handleBulkExport = () => {
    console.log('Bulk export contracts:', selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error('Nie sú vybraté žiadne zmluvy na export');
      return;
    }

    bulkExport(selectedContracts);
  };

  const customActions: BulkAction[] = [
    {
      id: 'update',
      label: 'Upraviť',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => setShowUpdateForm(!showUpdateForm)
    }
  ];

  if (selectedContracts.length === 0) return null;

  return (
    <>
      <GenericBulkActionsPanel
        selectedCount={selectedContracts.length}
        entityName="zmluva"
        entityNamePlural="zmlúv"
        onClearSelection={onClearSelection}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        customActions={customActions}
        isLoading={isLoading}
      />

      {showUpdateForm && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-4 min-w-96">
          <h3 className="text-lg font-semibold mb-4">Upraviť zmluvy</h3>
          
          <div className="space-y-4">
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
                  onClick={() => handleBulkUpdate('contractType', contractType)}
                  disabled={!contractType || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
                  onClick={() => handleBulkUpdate('salesPerson', salesPerson)}
                  disabled={!salesPerson || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsHandler;
