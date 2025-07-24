export interface ModuleSelection {
  id: string;
  name: string;
  selected: boolean;
  required?: boolean;
  monthlyFee: number;
  companyCost: number;
}

export interface SystemSelection {
  id: string;
  name: string;
  selected: boolean;
  monthlyFee: number;
  companyCost: number;
}

export interface SelectionFlowState {
  selectedSolution: string | null;
  requiresModules: boolean;
  selectedModules: ModuleSelection[];
  availableSystems: SystemSelection[];
  selectedSystem: string | null;
  currentStep: 'solution' | 'modules' | 'system' | 'products';
}

export interface ProgressiveSelectionData {
  selectionFlow: SelectionFlowState;
}