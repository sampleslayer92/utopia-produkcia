import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type EntityType = 'contracts' | 'merchants' | 'organizations' | 'users' | 'teams';

export interface ContractStatus {
  id: string;
  name: string;
  label: string;
  description?: string;
  color: string;
  is_system: boolean;
  is_active: boolean;
  position: number;
  category: 'general' | 'in_progress' | 'completed' | 'cancelled';
  entity_type: EntityType;
}

export const useContractStatuses = (entityType: EntityType = 'contracts') => {
  const [statuses, setStatuses] = useState<ContractStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contract_statuses')
        .select('*')
        .eq('is_active', true)
        .eq('entity_type', entityType)
        .order('position');

      if (error) throw error;

      const formattedStatuses: ContractStatus[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        label: item.label,
        description: item.description,
        color: item.color,
        is_system: item.is_system,
        is_active: item.is_active,
        position: item.position,
        category: item.category as ContractStatus['category'],
        entity_type: item.entity_type as EntityType
      }));

      setStatuses(formattedStatuses);
      setError(null);
    } catch (err) {
      console.error('Error fetching contract statuses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const createStatus = async (status: Omit<ContractStatus, 'id'>) => {
    try {
      const statusWithEntityType = {
        ...status,
        entity_type: entityType
      };
      
      const { data, error } = await supabase
        .from('contract_statuses')
        .insert(statusWithEntityType)
        .select()
        .single();

      if (error) throw error;

      const formattedStatus: ContractStatus = {
        id: data.id,
        name: data.name,
        label: data.label,
        description: data.description,
        color: data.color,
        is_system: data.is_system,
        is_active: data.is_active,
        position: data.position,
        category: data.category as ContractStatus['category'],
        entity_type: data.entity_type as EntityType
      };

      setStatuses(prev => [...prev, formattedStatus].sort((a, b) => a.position - b.position));
      return { success: true, data: formattedStatus };
    } catch (err) {
      console.error('Error creating status:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create status' };
    }
  };

  const updateStatus = async (id: string, updates: Partial<ContractStatus>) => {
    try {
      const { error } = await supabase
        .from('contract_statuses')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setStatuses(prev => prev.map(status => 
        status.id === id ? { ...status, ...updates } : status
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating status:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update status' };
    }
  };

  const deleteStatus = async (id: string) => {
    try {
      // Don't delete system statuses
      const status = statuses.find(s => s.id === id);
      if (status?.is_system) {
        return { success: false, error: 'Cannot delete system status' };
      }

      const { error } = await supabase
        .from('contract_statuses')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setStatuses(prev => prev.filter(status => status.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting status:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete status' };
    }
  };

  const reorderStatuses = async (reorderedStatuses: ContractStatus[]) => {
    try {
      const updates = reorderedStatuses.map((status, index) => ({
        id: status.id,
        position: index
      }));

      for (const update of updates) {
        await supabase
          .from('contract_statuses')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      setStatuses(reorderedStatuses);
      return { success: true };
    } catch (err) {
      console.error('Error reordering statuses:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to reorder statuses' };
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, [entityType]);

  return {
    statuses,
    isLoading,
    error,
    createStatus,
    updateStatus,
    deleteStatus,
    reorderStatuses,
    refetch: fetchStatuses
  };
};