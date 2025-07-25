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
}

export const useTranslations = (language?: string, namespace?: string) => {
  return useQuery({
    queryKey: ['translations', language, namespace],
    queryFn: async () => {
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
      return data as Translation[];
    },
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
    mutationFn: async (translation: Omit<Translation, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { error } = await supabase
        .from('translations')
        .insert(translation);
      
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