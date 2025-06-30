
import { useTranslation } from 'react-i18next';
import { useBulkContractActions } from "@/hooks/useBulkContractActions";
import { toast } from "sonner";
import BulkActionsPanel from "./BulkActionsPanel";

interface BulkActionsHandlerProps {
  selectedContracts: string[];
  onClearSelection: () => void;
}

const BulkActionsHandler = ({
  selectedContracts,
  onClearSelection
}: BulkActionsHandlerProps) => {
  const { t } = useTranslation('admin');
  const { bulkUpdate, bulkDelete, isUpdating, isDeleting } = useBulkContractActions();

  const handleBulkUpdate = (field: string, value: string) => {
    console.log(`Bulk update: ${field} = ${value} on contracts:`, selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsSelected'));
      return;
    }

    bulkUpdate(
      { contractIds: selectedContracts, field, value },
      {
        onSuccess: () => {
          onClearSelection();
        },
        onError: (error) => {
          console.error('Bulk update failed:', error);
        }
      }
    );
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete contracts:', selectedContracts);
    
    if (selectedContracts.length === 0) {
      toast.error(t('messages.noContractsToDelete'));
      return;
    }

    const getDeleteUnit = (count: number) => {
      if (count === 1) return t('messages.deleteUnits.single');
      if (count < 5) return t('messages.deleteUnits.few');
      return t('messages.deleteUnits.many');
    };

    const confirmed = window.confirm(
      t('messages.confirmDelete', { 
        count: selectedContracts.length, 
        unit: getDeleteUnit(selectedContracts.length) 
      })
    );

    if (!confirmed) {
      console.log('Bulk delete cancelled by user');
      return;
    }

    bulkDelete(selectedContracts, {
      onSuccess: () => {
        onClearSelection();
      },
      onError: (error) => {
        console.error('Bulk delete failed:', error);
      }
    });
  };

  if (selectedContracts.length === 0) return null;

  return (
    <BulkActionsPanel
      selectedCount={selectedContracts.length}
      onClearSelection={onClearSelection}
      onBulkUpdate={handleBulkUpdate}
      onBulkDelete={handleBulkDelete}
      isLoading={isUpdating || isDeleting}
    />
  );
};

export default BulkActionsHandler;
