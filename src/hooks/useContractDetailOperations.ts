
import { useState, useCallback } from 'react';
import { useContractUpdate } from './useContractUpdate';
import { useContractDelete } from './useContractDelete';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useContractDetailOperations = (contractId: string, contract: any) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [clientOperationsHasChanges, setClientOperationsHasChanges] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateContract = useContractUpdate(contractId);
  const deleteContract = useContractDelete();

  const handleSave = useCallback(async () => {
    try {
      console.log('=== ContractDetailOperations handleSave ===');
      
      // Check if there's a global commit function for client operations
      const commitClientOperations = (window as any).__commitClientOperationsChanges;
      let clientOperationsData = null;
      
      if (commitClientOperations && clientOperationsHasChanges) {
        console.log('Committing client operations changes');
        clientOperationsData = await commitClientOperations();
      }

      if (clientOperationsData) {
        console.log('Updating contract with client operations data:', clientOperationsData);
        await updateContract.mutateAsync({ data: clientOperationsData });
      }

      // Invalidate all contract-related queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['merchants'] });

      setIsEditMode(false);
      setClientOperationsHasChanges(false);
      
      toast({
        title: "Zmluva uložená",
        description: "Všetky zmeny boli úspešne uložené.",
      });
    } catch (error) {
      console.error('Error saving contract:', error);
      toast({
        title: "Chyba pri ukladaní",
        description: "Nepodarilo sa uložiť zmeny. Skúste to znovu.",
        variant: "destructive",
      });
    }
  }, [contractId, updateContract, clientOperationsHasChanges, queryClient, toast]);

  const handleToggleEdit = useCallback(() => {
    if (isEditMode && clientOperationsHasChanges) {
      // Ask user if they want to save changes
      const shouldSave = window.confirm('Máte neuložené zmeny. Chcete ich uložiť?');
      if (shouldSave) {
        handleSave();
        return;
      } else {
        setClientOperationsHasChanges(false);
      }
    }
    setIsEditMode(!isEditMode);
  }, [isEditMode, clientOperationsHasChanges, handleSave]);

  const handleDelete = useCallback(async () => {
    if (!contract) return;
    
    try {
      await deleteContract.mutateAsync(contract.id);
      
      // Invalidate queries after deletion
      queryClient.invalidateQueries({ queryKey: ['enhanced-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      
      toast({
        title: "Zmluva zmazaná",
        description: `Zmluva ${contract.contract_number} bola úspešne zmazaná.`,
      });
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast({
        title: "Chyba pri mazaní",
        description: "Nepodarilo sa zmazať zmluvu. Skúste to znovu.",
        variant: "destructive",
      });
    }
  }, [contract, deleteContract, queryClient, toast]);

  const handleClientOperationsUpdate = useCallback(async (data: any) => {
    try {
      await updateContract.mutateAsync({ data });
      
      // Invalidate queries for real-time updates
      queryClient.invalidateQueries({ queryKey: ['contract-complete', contractId] });
      queryClient.invalidateQueries({ queryKey: ['contract-data', contractId] });
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      
      toast({
        title: "Údaje aktualizované",
        description: "Zmeny boli úspešne uložené.",
      });
    } catch (error) {
      console.error('Error updating client operations:', error);
      toast({
        title: "Chyba pri aktualizácii",
        description: "Nepodarilo sa uložiť zmeny.",
        variant: "destructive",
      });
    }
  }, [contractId, updateContract, queryClient, toast]);

  const handleClientOperationsLocalChanges = useCallback((hasChanges: boolean) => {
    console.log('Client operations local changes:', hasChanges);
    setClientOperationsHasChanges(hasChanges);
  }, []);

  return {
    isEditMode,
    clientOperationsHasChanges,
    updateContract,
    deleteContract,
    handleSave,
    handleToggleEdit,
    handleDelete,
    handleClientOperationsUpdate,
    handleClientOperationsLocalChanges
  };
};
