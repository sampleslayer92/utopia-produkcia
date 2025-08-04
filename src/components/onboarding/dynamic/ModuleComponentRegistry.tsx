import { ComponentType } from 'react';
import type { OnboardingData } from '@/types/onboarding';

// Module interface for onboarding modules
export interface ModuleComponentProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  configuration?: Record<string, any>;
  isReadOnly?: boolean;
}

export type ModuleComponent = ComponentType<ModuleComponentProps>;

// Available module types
export interface ModuleDefinition {
  key: string;
  name: string;
  description: string;
  category: 'selection' | 'calculator' | 'catalog' | 'form' | 'other';
  component: ModuleComponent;
  defaultConfiguration?: Record<string, any>;
  configurationSchema?: {
    field: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
    defaultValue?: any;
  }[];
}

class ModuleComponentRegistry {
  private modules = new Map<string, ModuleDefinition>();

  register(moduleDefinition: ModuleDefinition) {
    this.modules.set(moduleDefinition.key, moduleDefinition);
  }

  getModule(moduleKey: string): ModuleDefinition | undefined {
    return this.modules.get(moduleKey);
  }

  getComponent(moduleKey: string): ModuleComponent | undefined {
    return this.modules.get(moduleKey)?.component;
  }

  getAllModules(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  getModulesByCategory(category: string): ModuleDefinition[] {
    return Array.from(this.modules.values()).filter(module => module.category === category);
  }

  unregister(moduleKey: string) {
    this.modules.delete(moduleKey);
  }

  clear() {
    this.modules.clear();
  }

  getModuleKeys(): string[] {
    return Array.from(this.modules.keys());
  }
}

// Create singleton instance
export const moduleComponentRegistry = new ModuleComponentRegistry();

// Export for external usage
export { ModuleComponentRegistry };