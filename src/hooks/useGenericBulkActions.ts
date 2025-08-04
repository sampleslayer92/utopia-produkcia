
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface BulkActionConfig<T> {
  entityName: string;
  queryKey: string[];
  bulkDelete?: (ids: string[], ...args: any[]) => Promise<void>;
  bulkUpdate?: (ids: string[], updates: Partial<T>) => Promise<void>;
  bulkActivate?: (ids: string[]) => Promise<void>;
  bulkDeactivate?: (ids: string[]) => Promise<void>;
  bulkExport?: (ids: string[]) => Promise<void>;
}

export const useGenericBulkActions = <T>(config: BulkActionConfig<T>) => {
  const queryClient = useQueryClient();

  const bulkDeleteMutation = useMutation({
    mutationFn: config.bulkDelete || (async () => { throw new Error('Bulk delete not implemented'); }),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      toast.success(`${Array.isArray(ids) ? ids.length : 0} ${config.entityName} úspešne vymazané`);
    },
    onError: (error) => {
      console.error('Bulk delete error:', error);
      const errorMessage = error instanceof Error ? error.message : `Chyba pri mazaní ${config.entityName}`;
      toast.error(errorMessage);
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, updates }: { ids: string[], updates: Partial<T> }) => 
      config.bulkUpdate ? config.bulkUpdate(ids, updates) : Promise.reject(new Error('Bulk update not implemented')),
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      toast.success(`${ids.length} ${config.entityName} úspešne aktualizované`);
    },
    onError: (error) => {
      console.error('Bulk update error:', error);
      toast.error(`Chyba pri aktualizácii ${config.entityName}`);
    }
  });

  const bulkActivateMutation = useMutation({
    mutationFn: config.bulkActivate || (async () => { throw new Error('Bulk activate not implemented'); }),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      toast.success(`${ids.length} ${config.entityName} úspešne aktivované`);
    },
    onError: (error) => {
      console.error('Bulk activate error:', error);
      toast.error(`Chyba pri aktivácii ${config.entityName}`);
    }
  });

  const bulkDeactivateMutation = useMutation({
    mutationFn: config.bulkDeactivate || (async () => { throw new Error('Bulk deactivate not implemented'); }),
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: config.queryKey });
      toast.success(`${ids.length} ${config.entityName} úspešne deaktivované`);
    },
    onError: (error) => {
      console.error('Bulk deactivate error:', error);
      toast.error(`Chyba pri deaktivácii ${config.entityName}`);
    }
  });

  const bulkExportMutation = useMutation({
    mutationFn: config.bulkExport || (async () => { throw new Error('Bulk export not implemented'); }),
    onSuccess: (_, ids) => {
      toast.success(`${ids.length} ${config.entityName} úspešne exportované`);
    },
    onError: (error) => {
      console.error('Bulk export error:', error);
      toast.error(`Chyba pri exporte ${config.entityName}`);
    }
  });

  return {
    bulkDelete: bulkDeleteMutation.mutate,
    bulkUpdate: bulkUpdateMutation.mutate,
    bulkActivate: bulkActivateMutation.mutate,
    bulkDeactivate: bulkDeactivateMutation.mutate,
    bulkExport: bulkExportMutation.mutate,
    isDeleting: bulkDeleteMutation.isPending,
    isUpdating: bulkUpdateMutation.isPending,
    isActivating: bulkActivateMutation.isPending,
    isDeactivating: bulkDeactivateMutation.isPending,
    isExporting: bulkExportMutation.isPending,
    isLoading: bulkDeleteMutation.isPending || bulkUpdateMutation.isPending || 
               bulkActivateMutation.isPending || bulkDeactivateMutation.isPending ||
               bulkExportMutation.isPending
  };
};
