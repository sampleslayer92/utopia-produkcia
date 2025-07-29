import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OnboardingConfig {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  steps: OnboardingStepConfig[];
}

export interface OnboardingStepConfig {
  id: string;
  step_key: string;
  title: string;
  description: string | null;
  position: number;
  is_enabled: boolean;
  fields: OnboardingFieldConfig[];
}

export interface OnboardingFieldConfig {
  id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  is_enabled: boolean;
  position: number;
  field_options: any;
}

const fetchOnboardingConfiguration = async (): Promise<OnboardingConfig | null> => {
  console.log('Fetching onboarding configuration...');
  
  // Get active configuration
  const { data: config, error: configError } = await supabase
    .from('onboarding_configurations')
    .select('*')
    .eq('is_active', true)
    .single();

  if (configError) {
    console.error('Error fetching configuration:', configError);
    return null;
  }

  if (!config) {
    console.log('No active configuration found');
    return null;
  }

  // Get steps for this configuration
  const { data: steps, error: stepsError } = await supabase
    .from('onboarding_steps')
    .select(`
      id,
      step_key,
      title,
      description,
      position,
      is_enabled,
      onboarding_fields (
        id,
        field_key,
        field_label,
        field_type,
        is_required,
        is_enabled,
        position,
        field_options
      )
    `)
    .eq('configuration_id', config.id)
    .order('position');

  if (stepsError) {
    console.error('Error fetching steps:', stepsError);
    return null;
  }

  // Transform the data
  const transformedSteps: OnboardingStepConfig[] = steps?.map(step => ({
    id: step.id,
    step_key: step.step_key,
    title: step.title,
    description: step.description,
    position: step.position,
    is_enabled: step.is_enabled,
    fields: (step.onboarding_fields || [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((field: any) => ({
        id: field.id,
        field_key: field.field_key,
        field_label: field.field_label,
        field_type: field.field_type,
        is_required: field.is_required,
        is_enabled: field.is_enabled,
        position: field.position,
        field_options: field.field_options
      }))
  })) || [];

  console.log('Configuration loaded:', { config: config.name, steps: transformedSteps.length });

  return {
    id: config.id,
    name: config.name,
    description: config.description,
    is_active: config.is_active,
    steps: transformedSteps
  };
};

export const useOnboardingConfiguration = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['onboarding-configuration'],
    queryFn: fetchOnboardingConfiguration,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Set up real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscription for onboarding configuration...');
    
    const configChannel = supabase
      .channel('onboarding-config-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_configurations'
        },
        (payload) => {
          console.log('Configuration changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['onboarding-configuration'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_steps'
        },
        (payload) => {
          console.log('Steps changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['onboarding-configuration'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_fields'
        },
        (payload) => {
          console.log('Fields changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['onboarding-configuration'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up onboarding configuration subscription');
      supabase.removeChannel(configChannel);
    };
  }, [queryClient]);

  return query;
};

export const useStepConfiguration = (stepKey: string) => {
  const { data: config } = useOnboardingConfiguration();
  
  const step = config?.steps.find(s => s.step_key === stepKey && s.is_enabled);
  
  return {
    step,
    isStepEnabled: Boolean(step),
    fields: step?.fields.filter(f => f.is_enabled) || []
  };
};