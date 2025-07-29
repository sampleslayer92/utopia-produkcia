import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { OnboardingStep, OnboardingField } from '@/pages/OnboardingConfigPage';

// Default onboarding steps configuration
const DEFAULT_STEPS: Partial<OnboardingStep>[] = [
  {
    stepKey: 'contact_info',
    title: 'Kontaktné údaje',
    description: 'Základné kontaktné informácie',
    position: 0,
    isEnabled: true,
    isRequired: true,
    fields: []
  },
  {
    stepKey: 'company_info',
    title: 'Údaje o spoločnosti',
    description: 'Informácie o právnickej osobe',
    position: 1,
    isEnabled: true,
    isRequired: true,
    fields: []
  },
  {
    stepKey: 'business_locations',
    title: 'Miesta podnikania',
    description: 'Prevádzkové lokality a údaje',
    position: 2,
    isEnabled: true,
    isRequired: true,
    fields: []
  },
  {
    stepKey: 'device_selection',
    title: 'Výber zariadení',
    description: 'Výber technického vybavenia',
    position: 3,
    isEnabled: true,
    isRequired: true,
    fields: []
  },
  {
    stepKey: 'fees',
    title: 'Poplatky',
    description: 'Nastavenie poplatkov a provízie',
    position: 4,
    isEnabled: true,
    isRequired: false,
    fields: []
  },
  {
    stepKey: 'persons_and_owners',
    title: 'Oprávnené osoby a vlastníci',
    description: 'Splnomocnené osoby a skutoční vlastníci',
    position: 5,
    isEnabled: true,
    isRequired: true,
    fields: []
  },
  {
    stepKey: 'consents',
    title: 'Súhlasy',
    description: 'Potvrdenie a podpis zmluvy',
    position: 6,
    isEnabled: true,
    isRequired: true,
    fields: []
  }
];

export const useOnboardingConfig = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load configuration from database or use defaults
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // For now, just use default configuration since database tables may not exist yet
      // In production, this would check the actual onboarding configuration tables
      
      const defaultSteps = DEFAULT_STEPS.map((step, index) => ({
        id: `default_${index}`,
        ...step,
        fields: []
      })) as OnboardingStep[];
      
      setSteps(defaultSteps);
    } catch (error) {
      console.error('Error loading onboarding configuration:', error);
      // Fallback to default configuration
      const defaultSteps = DEFAULT_STEPS.map((step, index) => ({
        id: `default_${index}`,
        ...step,
        fields: []
      })) as OnboardingStep[];
      
      setSteps(defaultSteps);
    } finally {
      setLoading(false);
    }
  };

  const updateStepOrder = (newSteps: OnboardingStep[]) => {
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      position: index
    }));
    setSteps(reorderedSteps);
  };

  const updateStep = (stepId: string, updates: Partial<OnboardingStep>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  const addStep = (newStep: Partial<OnboardingStep>) => {
    const step: OnboardingStep = {
      id: `new_${Date.now()}`,
      stepKey: newStep.stepKey || `step_${Date.now()}`,
      title: newStep.title || 'Nový krok',
      description: newStep.description || '',
      position: newStep.position || steps.length,
      isEnabled: newStep.isEnabled ?? true,
      isRequired: newStep.isRequired ?? false,
      fields: newStep.fields || []
    };
    
    setSteps(prevSteps => [...prevSteps, step]);
  };

  const deleteStep = (stepId: string) => {
    setSteps(prevSteps => prevSteps.filter(step => step.id !== stepId));
  };

  const duplicateStep = (stepId: string) => {
    const stepToDuplicate = steps.find(step => step.id === stepId);
    if (stepToDuplicate) {
      const duplicatedStep: OnboardingStep = {
        ...stepToDuplicate,
        id: `dup_${Date.now()}`,
        stepKey: `${stepToDuplicate.stepKey}_copy`,
        title: `${stepToDuplicate.title} (kópia)`,
        position: steps.length
      };
      setSteps(prevSteps => [...prevSteps, duplicatedStep]);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      
      // This is a simplified save - in production, you'd save to the database
      console.log('Saving configuration:', steps);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async () => {
    try {
      setSaving(true);
      
      const defaultSteps = DEFAULT_STEPS.map((step, index) => ({
        id: `default_${index}`,
        ...step,
        fields: []
      })) as OnboardingStep[];
      
      setSteps(defaultSteps);
      
      return true;
    } catch (error) {
      console.error('Error resetting configuration:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    steps,
    loading,
    saving,
    updateStepOrder,
    updateStep,
    addStep,
    deleteStep,
    duplicateStep,
    saveConfiguration,
    resetToDefault
  };
};