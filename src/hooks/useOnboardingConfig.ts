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

// Step modules interface
interface StepModule {
  id: string;
  moduleKey: string;
  moduleName: string;
  position: number;
  isEnabled: boolean;
  configuration: Record<string, any>;
}

export const useOnboardingConfig = () => {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [stepModules, setStepModules] = useState<Record<string, StepModule[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load configuration from database or use defaults
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async (specificConfigId?: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Try to load from database first
      let configId = specificConfigId;
      
      if (!configId) {
        const { data: configurations } = await supabase
          .from('onboarding_configurations')
          .select('id, name, is_active')
          .eq('is_active', true)
          .limit(1);

        if (configurations && configurations.length > 0) {
          configId = configurations[0].id;
        }
      }

      if (configId) {
        
        // Load steps with their fields
        const { data: stepsData } = await supabase
          .from('onboarding_steps')
          .select(`
            id, step_key, title, description, position, is_enabled, 
            onboarding_fields (
              id, field_key, field_label, field_type, is_required, 
              is_enabled, position, field_options
            )
          `)
          .eq('configuration_id', configId)
          .order('position');

        // Load modules separately
        const { data: modulesData } = await supabase
          .from('step_modules')
          .select('id, step_id, module_key, module_name, position, is_enabled, configuration')
          .in('step_id', stepsData?.map(s => s.id) || [])
          .order('step_id, position');

        if (stepsData) {
          const formattedSteps = stepsData.map(step => ({
            id: step.id,
            stepKey: step.step_key,
            title: step.title,
            description: step.description || '',
            position: step.position,
            isEnabled: step.is_enabled,
            isRequired: false, // Set based on your logic
            fields: (step.onboarding_fields || []).map(field => ({
              id: field.id,
              fieldKey: field.field_key,
              fieldLabel: field.field_label,
              fieldType: field.field_type as any,
              isRequired: field.is_required,
              isEnabled: field.is_enabled,
              position: field.position || 0,
              fieldOptions: field.field_options || {}
            }))
          })) as OnboardingStep[];
          
          // Format step modules
          const modulesMap: Record<string, StepModule[]> = {};
          if (modulesData) {
            modulesData.forEach(module => {
              if (!modulesMap[module.step_id]) {
                modulesMap[module.step_id] = [];
              }
              modulesMap[module.step_id].push({
                id: module.id,
                moduleKey: module.module_key,
                moduleName: module.module_name,
                position: module.position,
                isEnabled: module.is_enabled,
                configuration: (module.configuration as Record<string, any>) || {}
              });
            });
          }
          
          setSteps(formattedSteps);
          setStepModules(modulesMap);
          return;
        }
      }
      
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
      setStepModules({});
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
      setStepModules({});
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

  const saveConfiguration = async (): Promise<void> => {
    try {
      setSaving(true);
      
      // Get or create active configuration
      let configId;
      const { data: configurations } = await supabase
        .from('onboarding_configurations')
        .select('id')
        .eq('is_active', true)
        .limit(1);

      if (configurations && configurations.length > 0) {
        configId = configurations[0].id;
      } else {
        // Create new configuration
        const { data: newConfig, error: configError } = await supabase
          .from('onboarding_configurations')
          .insert({
            name: 'Default Configuration',
            is_active: true
          })
          .select('id')
          .single();

        if (configError) throw configError;
        configId = newConfig.id;
      }

      // Delete existing steps and fields for this configuration
      await supabase
        .from('onboarding_steps')
        .delete()
        .eq('configuration_id', configId);

      // Insert steps in order
      for (const step of steps) {
        const { data: insertedStep, error: stepError } = await supabase
          .from('onboarding_steps')
          .insert({
            configuration_id: configId,
            step_key: step.stepKey,
            title: step.title,
            description: step.description,
            position: step.position,
            is_enabled: step.isEnabled
          })
          .select('id')
          .single();

        if (stepError) throw stepError;

        // Insert fields for this step
        if (step.fields && step.fields.length > 0) {
          const fieldsToInsert = step.fields.map(field => ({
            step_id: insertedStep.id,
            field_key: field.fieldKey,
            field_label: field.fieldLabel,
            field_type: field.fieldType,
            is_required: field.isRequired,
            is_enabled: field.isEnabled,
            position: field.position || 0,
            field_options: field.fieldOptions || {}
          }));

          const { error: fieldsError } = await supabase
            .from('onboarding_fields')
            .insert(fieldsToInsert);

          if (fieldsError) throw fieldsError;
        }
      }

      // Reload configuration to get fresh data with IDs
      await loadConfiguration();
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async (): Promise<void> => {
    try {
      setSaving(true);
      
      // Reset local state to defaults
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
      console.error('Error resetting configuration:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Module management functions
  const addStepModule = async (stepId: string, moduleKey: string, moduleName: string): Promise<void> => {
    try {
      const { data: insertedModule, error } = await supabase
        .from('step_modules')
        .insert({
          step_id: stepId,
          module_key: moduleKey,
          module_name: moduleName,
          position: (stepModules[stepId]?.length || 0),
          is_enabled: true,
          configuration: {}
        })
        .select('id, module_key, module_name, position, is_enabled, configuration')
        .single();

      if (error) throw error;

      const newModule: StepModule = {
        id: insertedModule.id,
        moduleKey: insertedModule.module_key,
        moduleName: insertedModule.module_name,
        position: insertedModule.position,
        isEnabled: insertedModule.is_enabled,
        configuration: (insertedModule.configuration as Record<string, any>) || {}
      };

      setStepModules(prev => ({
        ...prev,
        [stepId]: [...(prev[stepId] || []), newModule]
      }));
    } catch (error) {
      console.error('Error adding step module:', error);
      throw error;
    }
  };

  const updateStepModule = async (stepId: string, moduleId: string, updates: Partial<StepModule>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('step_modules')
        .update({
          module_name: updates.moduleName,
          position: updates.position,
          is_enabled: updates.isEnabled,
          configuration: updates.configuration
        })
        .eq('id', moduleId);

      if (error) throw error;

      setStepModules(prev => ({
        ...prev,
        [stepId]: (prev[stepId] || []).map(module => 
          module.id === moduleId ? { ...module, ...updates } : module
        )
      }));
    } catch (error) {
      console.error('Error updating step module:', error);
      throw error;
    }
  };

  const deleteStepModule = async (stepId: string, moduleId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('step_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;

      setStepModules(prev => ({
        ...prev,
        [stepId]: (prev[stepId] || []).filter(module => module.id !== moduleId)
      }));
    } catch (error) {
      console.error('Error deleting step module:', error);
      throw error;
    }
  };

  const reorderStepModules = async (stepId: string, newOrder: StepModule[]): Promise<void> => {
    try {
      // Update positions in database
      const updates = newOrder.map((module, index) => ({
        id: module.id,
        position: index
      }));

      for (const update of updates) {
        await supabase
          .from('step_modules')
          .update({ position: update.position })
          .eq('id', update.id);
      }

      // Update local state
      setStepModules(prev => ({
        ...prev,
        [stepId]: newOrder.map((module, index) => ({ ...module, position: index }))
      }));
    } catch (error) {
      console.error('Error reordering step modules:', error);
      throw error;
    }
  };

  const getStepModules = (stepId: string): StepModule[] => {
    return stepModules[stepId] || [];
  };

  return {
    steps,
    stepModules,
    loading,
    saving,
    loadConfiguration,
    updateStepOrder,
    updateStep,
    addStep,
    deleteStep,
    duplicateStep,
    saveConfiguration,
    resetToDefault,
    // Module management
    addStepModule,
    updateStepModule,
    deleteStepModule,
    reorderStepModules,
    getStepModules
  };
};