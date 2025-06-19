
import { useState } from "react";
import { useContractUpdate } from "@/hooks/useContractUpdate";
import { useContractDelete } from "@/hooks/useContractDelete";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const useContractDetailOperations = (contractId: string, contract: any) => {
  const { toast } = useToast();
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientOperationsHasChanges, setClientOperationsHasChanges] = useState(false);
  
  const updateContract = useContractUpdate(contractId);
  const deleteContract = useContractDelete();

  const handleSave = async () => {
    console.log('HandleSave called with state:', { 
      clientOperationsHasChanges,
      isEditMode
    });

    // Call the global commit function exposed by EnhancedClientOperationsSection
    const commitFunction = (window as any).__commitClientOperationsChanges;
    console.log('Commit function available:', !!commitFunction);
    
    if (commitFunction) {
      try {
        console.log('Calling commit function...');
        const updatedData = await commitFunction();
        console.log('Commit function returned data:', updatedData);
        
        if (updatedData) {
          console.log('Data received from commit, calling updateContract mutation...');
          await updateContract.mutateAsync({
            data: updatedData
          });
          
          setClientOperationsHasChanges(false);
          setIsEditMode(false);
          
          toast({
            title: t('messages.contractSaved'),
            description: t('messages.contractSavedDesc'),
          });
        } else {
          console.warn('No data returned from commit function');
          toast({
            title: t('messages.noChanges'),
            description: t('messages.noChangesDesc'),
          });
        }
      } catch (error) {
        console.error('Error in handleSave:', error);
        
        let errorMessage = t('messages.saveErrorDesc');
        if (error instanceof Error) {
          errorMessage = error.message;
          console.error('Error details:', error.stack);
        }
        
        toast({
          title: t('messages.saveError'),
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.error('Commit function not available on window object');
      toast({
        title: t('messages.saveError'),
        description: "Funkcia uloženia nie je dostupná. Skúste obnoviť stránku.",
        variant: "destructive",
      });
    }
  };

  const handleToggleEdit = () => {
    console.log('Toggling edit mode. Current state:', { 
      isEditMode, 
      clientOperationsHasChanges
    });
    
    if (isEditMode && clientOperationsHasChanges) {
      const shouldSave = window.confirm('Máte neuložené zmeny. Chcete ich uložiť pred ukončením editácie?');
      if (shouldSave) {
        handleSave();
        return; // Don't toggle edit mode here, it will be done in handleSave after successful save
      } else {
        setClientOperationsHasChanges(false);
      }
    }
    
    setIsEditMode(!isEditMode);
  };

  const handleDelete = async () => {
    if (!contractId) {
      console.error('No contract ID available for deletion');
      return;
    }

    // Don't attempt deletion if contract is null (component still loading)
    if (!contract) {
      console.warn('Contract data not available, skipping delete operation');
      return;
    }

    console.log('Delete button clicked for contract:', contractId);
    
    const confirmed = window.confirm(
      t('messages.confirmDelete', { contractNumber: contract.contract_number })
    );
    
    if (!confirmed) {
      console.log('Delete cancelled by user');
      return;
    }

    try {
      console.log('Attempting to delete contract:', contractId);
      await deleteContract.mutateAsync(contractId);
      
      toast({
        title: t('messages.contractDeleted'),
        description: t('messages.contractDeletedDesc'),
      });
      
      console.log('Contract deleted successfully, navigating to admin');
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting contract:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Neočakávaná chyba pri mazaní zmluvy';
      
      toast({
        title: t('messages.deleteError'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Updated to async function to match expected type
  const handleClientOperationsUpdate = async (updatedData: any) => {
    console.log('Client operations updated, saving:', updatedData);
    
    try {
      await updateContract.mutateAsync({
        data: updatedData
      });
      
      setClientOperationsHasChanges(false);
      
      toast({
        title: t('messages.contractSaved'),
        description: t('messages.contractSavedDesc'),
      });
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: t('messages.saveError'),
        description: t('messages.saveErrorDesc'),
        variant: "destructive",
      });
    }
  };

  const handleClientOperationsLocalChanges = (hasChanges: boolean) => {
    console.log('Client operations local changes:', hasChanges);
    setClientOperationsHasChanges(hasChanges);
  };

  return {
    isEditMode,
    clientOperationsHasChanges,
    updateContract,
    deleteContract,
    handleSave,
    handleToggleEdit,
    handleDelete,
    handleClientOperationsUpdate,
    handleClientOperationsLocalChanges,
    setClientOperationsHasChanges,
    setIsEditMode
  };
};
