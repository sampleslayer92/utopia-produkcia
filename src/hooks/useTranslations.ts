import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Translation {
  id: string;
  key: string;
  namespace: string;
  language: string;
  value: string;
  is_system: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  version?: number;
  last_modified_by?: string | null;
  is_auto_translated?: boolean;
  metadata?: Record<string, any>;
}

export const useTranslations = (language?: string, namespace?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['translations', language, namespace, searchTerm],
    queryFn: async () => {
      let query = supabase.from('translations').select('*');
      
      if (language) {
        query = query.eq('language', language);
      }
      
      if (namespace) {
        query = query.eq('namespace', namespace);
      }
      
      if (searchTerm) {
        query = query.or(`key.ilike.%${searchTerm}%,value.ilike.%${searchTerm}%`);
      }
      
      query = query.order('namespace').order('key');
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Translation[];
    },
  });
};

export const useSearchTranslations = (searchTerm: string, language?: string) => {
  return useQuery({
    queryKey: ['translations-search', searchTerm, language],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      let query = supabase.from('translations').select('*');
      
      if (language) {
        query = query.eq('language', language);
      }
      
      query = query.or(`key.ilike.%${searchTerm}%,value.ilike.%${searchTerm}%`);
      query = query.order('namespace').order('key').limit(100);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Translation[];
    },
    enabled: searchTerm.trim().length > 2,
  });
};

export const useTranslationNamespaces = () => {
  return useQuery({
    queryKey: ['translation-namespaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('namespace')
        .order('namespace');
      
      if (error) throw error;
      
      const uniqueNamespaces = [...new Set(data.map(item => item.namespace))];
      return uniqueNamespaces;
    },
  });
};

export const useTranslationLanguages = () => {
  return useQuery({
    queryKey: ['translation-languages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('translations')
        .select('language')
        .order('language');
      
      if (error) throw error;
      
      const uniqueLanguages = [...new Set(data.map(item => item.language))];
      return uniqueLanguages;
    },
  });
};

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase
        .from('translations')
        .update({ value })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: 'Preklad aktualizovaný',
        description: 'Preklad bol úspešne aktualizovaný.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa aktualizovať preklad.',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (translation: Omit<Translation, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'version' | 'last_modified_by'>) => {
      const { error } = await supabase
        .from('translations')
        .insert({
          ...translation,
          version: 1,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      queryClient.invalidateQueries({ queryKey: ['translation-namespaces'] });
      queryClient.invalidateQueries({ queryKey: ['translation-languages'] });
      toast({
        title: 'Preklad vytvorený',
        description: 'Nový preklad bol úspešne vytvorený.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa vytvoriť preklad.',
        variant: 'destructive',
      });
    },
  });
};

export const useBulkUpdateTranslations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: Array<{ id: string; value: string }>) => {
      const promises = updates.map(async ({ id, value }) => {
        // First get current version
        const { data: current } = await supabase
          .from('translations')
          .select('version')
          .eq('id', id)
          .single();
        
        // Then update with incremented version
        return supabase
          .from('translations')
          .update({ 
            value,
            version: (current?.version || 1) + 1
          })
          .eq('id', id);
      });
      
      const results = await Promise.all(promises);
      const errors = results.filter(result => result.error);
      
      if (errors.length > 0) {
        throw new Error(`${errors.length} prekladov sa nepodarilo aktualizovať`);
      }
    },
    onSuccess: (_, updates) => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: 'Hromadná aktualizácia úspešná',
        description: `${updates.length} prekladov bolo aktualizovaných.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba pri hromadnej aktualizácii',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useExportTranslations = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ language, namespace }: { language?: string; namespace?: string }) => {
      let query = supabase.from('translations').select('*');
      
      if (language) {
        query = query.eq('language', language);
      }
      
      if (namespace) {
        query = query.eq('namespace', namespace);
      }
      
      query = query.order('namespace').order('key');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert to CSV format
      const headers = ['key', 'namespace', 'language', 'value', 'is_system', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ].join('\n');
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${language || 'all'}-${namespace || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return data.length;
    },
    onSuccess: (count) => {
      toast({
        title: 'Export úspešný',
        description: `${count} prekladov bolo exportovaných.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba pri exporte',
        description: 'Nepodarilo sa exportovať preklady.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTranslation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('translations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast({
        title: 'Preklad zmazaný',
        description: 'Preklad bol úspešne zmazaný.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Chyba',
        description: 'Nepodarilo sa zmazať preklad.',
        variant: 'destructive',
      });
    },
  });
};