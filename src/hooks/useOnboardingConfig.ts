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
    fields: [
      { fieldKey: 'salutation', fieldLabel: 'Oslovenie', fieldType: 'select', isRequired: false, isEnabled: true, position: 0 },
      { fieldKey: 'firstName', fieldLabel: 'Meno', fieldType: 'text', isRequired: true, isEnabled: true, position: 1 },
      { fieldKey: 'lastName', fieldLabel: 'Priezvisko', fieldType: 'text', isRequired: true, isEnabled: true, position: 2 },
      { fieldKey: 'email', fieldLabel: 'Email', fieldType: 'email', isRequired: true, isEnabled: true, position: 3 },
      { fieldKey: 'phonePrefix', fieldLabel: 'Predvolba', fieldType: 'select', isRequired: true, isEnabled: true, position: 4 },
      { fieldKey: 'phone', fieldLabel: 'Telefón', fieldType: 'tel', isRequired: true, isEnabled: true, position: 5 },
      { fieldKey: 'salesNote', fieldLabel: 'Poznámka pre predaj', fieldType: 'textarea', isRequired: false, isEnabled: true, position: 6 },
      { fieldKey: 'userRoles', fieldLabel: 'Používateľské role', fieldType: 'multiselect', isRequired: false, isEnabled: true, position: 7 }
    ]
  },
  {
    stepKey: 'company_info',
    title: 'Údaje o spoločnosti',
    description: 'Informácie o právnickej osobe',
    position: 1,
    isEnabled: true,
    isRequired: true,
    fields: [
      { fieldKey: 'companyName', fieldLabel: 'Názov spoločnosti', fieldType: 'text', isRequired: true, isEnabled: true, position: 0 },
      { fieldKey: 'ico', fieldLabel: 'IČO', fieldType: 'text', isRequired: true, isEnabled: true, position: 1 },
      { fieldKey: 'dic', fieldLabel: 'DIČ', fieldType: 'text', isRequired: true, isEnabled: true, position: 2 },
      { fieldKey: 'registryType', fieldLabel: 'Typ registra', fieldType: 'select', isRequired: true, isEnabled: true, position: 3 },
      { fieldKey: 'isVatPayer', fieldLabel: 'Platca DPH', fieldType: 'checkbox', isRequired: false, isEnabled: true, position: 4 },
      { fieldKey: 'vatNumber', fieldLabel: 'IČ DPH', fieldType: 'text', isRequired: false, isEnabled: true, position: 5 },
      { fieldKey: 'court', fieldLabel: 'Súd', fieldType: 'text', isRequired: false, isEnabled: true, position: 6 },
      { fieldKey: 'section', fieldLabel: 'Oddiel', fieldType: 'text', isRequired: false, isEnabled: true, position: 7 },
      { fieldKey: 'insertNumber', fieldLabel: 'Vložka číslo', fieldType: 'text', isRequired: false, isEnabled: true, position: 8 },
      { fieldKey: 'address.street', fieldLabel: 'Ulica a číslo', fieldType: 'text', isRequired: true, isEnabled: true, position: 9 },
      { fieldKey: 'address.city', fieldLabel: 'Mesto', fieldType: 'text', isRequired: true, isEnabled: true, position: 10 },
      { fieldKey: 'address.zipCode', fieldLabel: 'PSČ', fieldType: 'text', isRequired: true, isEnabled: true, position: 11 },
      { fieldKey: 'contactAddressSameAsMain', fieldLabel: 'Korešpondenčná adresa rovnaká', fieldType: 'checkbox', isRequired: false, isEnabled: true, position: 12 },
      { fieldKey: 'headOfficeEqualsOperatingAddress', fieldLabel: 'Sídlo rovnaké ako prevádzka', fieldType: 'checkbox', isRequired: false, isEnabled: true, position: 13 },
      { fieldKey: 'contactPerson.firstName', fieldLabel: 'Meno kontaktnej osoby', fieldType: 'text', isRequired: true, isEnabled: true, position: 14 },
      { fieldKey: 'contactPerson.lastName', fieldLabel: 'Priezvisko kontaktnej osoby', fieldType: 'text', isRequired: true, isEnabled: true, position: 15 },
      { fieldKey: 'contactPerson.email', fieldLabel: 'Email kontaktnej osoby', fieldType: 'email', isRequired: true, isEnabled: true, position: 16 },
      { fieldKey: 'contactPerson.phone', fieldLabel: 'Telefón kontaktnej osoby', fieldType: 'tel', isRequired: true, isEnabled: true, position: 17 },
      { fieldKey: 'contactPerson.isTechnicalPerson', fieldLabel: 'Je technická osoba', fieldType: 'checkbox', isRequired: false, isEnabled: true, position: 18 }
    ]
  },
  {
    stepKey: 'business_locations',
    title: 'Miesta podnikania',
    description: 'Prevádzkové lokality a údaje',
    position: 2,
    isEnabled: true,
    isRequired: true,
    fields: [
      { fieldKey: 'name', fieldLabel: 'Názov lokality', fieldType: 'text', isRequired: true, isEnabled: true, position: 0 },
      { fieldKey: 'hasPOS', fieldLabel: 'Má POS terminál', fieldType: 'checkbox', isRequired: false, isEnabled: true, position: 1 },
      { fieldKey: 'address.street', fieldLabel: 'Ulica a číslo', fieldType: 'text', isRequired: true, isEnabled: true, position: 2 },
      { fieldKey: 'address.city', fieldLabel: 'Mesto', fieldType: 'text', isRequired: true, isEnabled: true, position: 3 },
      { fieldKey: 'address.zipCode', fieldLabel: 'PSČ', fieldType: 'text', isRequired: true, isEnabled: true, position: 4 },
      { fieldKey: 'iban', fieldLabel: 'IBAN', fieldType: 'text', isRequired: true, isEnabled: true, position: 5 },
      { fieldKey: 'contactPerson.name', fieldLabel: 'Meno kontaktnej osoby', fieldType: 'text', isRequired: true, isEnabled: true, position: 6 },
      { fieldKey: 'contactPerson.email', fieldLabel: 'Email kontaktnej osoby', fieldType: 'email', isRequired: true, isEnabled: true, position: 7 },
      { fieldKey: 'contactPerson.phone', fieldLabel: 'Telefón kontaktnej osoby', fieldType: 'tel', isRequired: true, isEnabled: true, position: 8 },
      { fieldKey: 'businessSector', fieldLabel: 'Sektor podnikania', fieldType: 'select', isRequired: true, isEnabled: true, position: 9 },
      { fieldKey: 'businessSubject', fieldLabel: 'Predmet podnikania', fieldType: 'text', isRequired: false, isEnabled: true, position: 10 },
      { fieldKey: 'mccCode', fieldLabel: 'MCC kód', fieldType: 'text', isRequired: false, isEnabled: true, position: 11 },
      { fieldKey: 'estimatedTurnover', fieldLabel: 'Odhadovaný obrat', fieldType: 'number', isRequired: true, isEnabled: true, position: 12 },
      { fieldKey: 'monthlyTurnover', fieldLabel: 'Mesačný obrat', fieldType: 'number', isRequired: false, isEnabled: true, position: 13 },
      { fieldKey: 'averageTransaction', fieldLabel: 'Priemerná transakcia', fieldType: 'number', isRequired: true, isEnabled: true, position: 14 },
      { fieldKey: 'openingHours', fieldLabel: 'Otváracie hodiny', fieldType: 'text', isRequired: true, isEnabled: true, position: 15 },
      { fieldKey: 'seasonality', fieldLabel: 'Sezónnosť', fieldType: 'select', isRequired: true, isEnabled: true, position: 16 },
      { fieldKey: 'seasonalWeeks', fieldLabel: 'Počet sezónnych týždňov', fieldType: 'number', isRequired: false, isEnabled: true, position: 17 }
    ]
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
        fields: step.fields?.map((field, fieldIndex) => ({
          id: `field_${index}_${fieldIndex}`,
          ...field
        })) || []
      })) as OnboardingStep[];
      
      setSteps(defaultSteps);
    } catch (error) {
      console.error('Error loading onboarding configuration:', error);
      // Fallback to default configuration
      const defaultSteps = DEFAULT_STEPS.map((step, index) => ({
        id: `default_${index}`,
        ...step,
        fields: step.fields?.map((field, fieldIndex) => ({
          id: `field_${index}_${fieldIndex}`,
          ...field
        })) || []
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
        fields: step.fields?.map((field, fieldIndex) => ({
          id: `field_${index}_${fieldIndex}`,
          ...field
        })) || []
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