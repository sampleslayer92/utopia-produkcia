
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContractTemplate {
  id: string;
  name: string;
  description?: string;
  template_data: any;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useContractTemplates = () => {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Chyba pri načítavaní šablón');
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (template: Omit<ContractTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      
      setTemplates(prev => [data, ...prev]);
      toast.success('Šablóna bola vytvorená');
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Chyba pri vytváraní šablóny');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTemplate = async (id: string, updates: Partial<ContractTemplate>) => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('contract_templates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Šablóna bola aktualizovaná');
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Chyba pri aktualizácii šablóny');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contract_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      setTemplates(prev => prev.filter(t => t.id !== id));
      toast.success('Šablóna bola deaktivovaná');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Chyba pri mazaní šablóny');
      throw error;
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    isSaving,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};
