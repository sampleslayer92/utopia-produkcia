import { moduleComponentRegistry } from './ModuleComponentRegistry';
import SolutionSelectionWrapper from './wrappers/SolutionSelectionWrapper';
import CalculatorWrapper from './wrappers/CalculatorWrapper';
import DeviceCatalogWrapper from './wrappers/DeviceCatalogWrapper';

// Register all available modules
moduleComponentRegistry.register({
  key: 'solution_selection',
  name: 'Výber riešenia',
  description: 'Modul pre výber riešení a služieb',
  category: 'selection',
  component: SolutionSelectionWrapper,
  defaultConfiguration: {
    allowMultipleSelection: true,
    showDescriptions: true
  },
  configurationSchema: [
    {
      field: 'allowMultipleSelection',
      label: 'Povoliť výber viacerých riešení',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'showDescriptions',
      label: 'Zobraziť popisy',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'profit_calculator',
  name: 'Kalkulačka zisku',
  description: 'Kalkulačka pre výpočet zisku v reálnom čase',
  category: 'calculator',
  component: CalculatorWrapper,
  defaultConfiguration: {
    showAdvancedOptions: false,
    autoCalculate: true
  },
  configurationSchema: [
    {
      field: 'showAdvancedOptions',
      label: 'Zobraziť pokročilé možnosti',
      type: 'boolean',
      defaultValue: false
    },
    {
      field: 'autoCalculate',
      label: 'Automatický výpočet',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'device_catalog',
  name: 'Katalóg zariadení',
  description: 'Katalóg zariadení a služieb na výber',
  category: 'catalog',
  component: DeviceCatalogWrapper,
  defaultConfiguration: {
    showPrices: true,
    groupByCategory: true
  },
  configurationSchema: [
    {
      field: 'showPrices',
      label: 'Zobraziť ceny',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'groupByCategory',
      label: 'Zoskupiť podľa kategórie',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

// Export the registry for use in other components
export { moduleComponentRegistry };