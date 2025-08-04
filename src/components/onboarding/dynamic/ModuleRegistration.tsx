import { moduleComponentRegistry } from './ModuleComponentRegistry';
import SolutionSelectionWrapper from './wrappers/SolutionSelectionWrapper';
import CalculatorWrapper from './wrappers/CalculatorWrapper';
import DeviceCatalogWrapper from './wrappers/DeviceCatalogWrapper';
import ContactInfoWrapper from './wrappers/ContactInfoWrapper';
import CompanyInfoWrapper from './wrappers/CompanyInfoWrapper';
import BusinessLocationWrapper from './wrappers/BusinessLocationWrapper';
import AuthorizedPersonsWrapper from './wrappers/AuthorizedPersonsWrapper';
import ActualOwnersWrapper from './wrappers/ActualOwnersWrapper';
import ConsentsWrapper from './wrappers/ConsentsWrapper';

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

// Register form modules
moduleComponentRegistry.register({
  key: 'contact_info',
  name: 'Kontaktné informácie',
  description: 'Zber základných kontaktných údajov',
  category: 'form',
  component: ContactInfoWrapper,
  defaultConfiguration: {
    showSalutation: true,
    requirePhone: true
  },
  configurationSchema: [
    {
      field: 'showSalutation',
      label: 'Zobraziť oslovenie',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'requirePhone',
      label: 'Vyžadovať telefón',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'company_info',
  name: 'Informácie o spoločnosti',
  description: 'Zber údajov o spoločnosti a jej adrese',
  category: 'form',
  component: CompanyInfoWrapper,
  defaultConfiguration: {
    showVatFields: true,
    requireAddress: true
  },
  configurationSchema: [
    {
      field: 'showVatFields',
      label: 'Zobraziť DPH polia',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'requireAddress',
      label: 'Vyžadovať adresu',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'business_location',
  name: 'Lokality podniku',
  description: 'Správa obchodných lokalít a ich údajov',
  category: 'business',
  component: BusinessLocationWrapper,
  defaultConfiguration: {
    allowMultipleLocations: true,
    requireBankAccount: true
  },
  configurationSchema: [
    {
      field: 'allowMultipleLocations',
      label: 'Povoliť viacero lokalít',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'requireBankAccount',
      label: 'Vyžadovať bankový účet',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

// Register legal modules
moduleComponentRegistry.register({
  key: 'authorized_persons',
  name: 'Oprávnené osoby',
  description: 'Správa oprávnených osôb spoločnosti',
  category: 'legal',
  component: AuthorizedPersonsWrapper,
  defaultConfiguration: {
    requireDocument: true,
    allowMultiple: true
  },
  configurationSchema: [
    {
      field: 'requireDocument',
      label: 'Vyžadovať doklad',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'allowMultiple',
      label: 'Povoliť viacero osôb',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'actual_owners',
  name: 'Skutoční vlastníci',
  description: 'Identifikácia skutočných vlastníkov spoločnosti',
  category: 'legal',
  component: ActualOwnersWrapper,
  defaultConfiguration: {
    requireOwnership: true,
    showPoliticalExposure: true
  },
  configurationSchema: [
    {
      field: 'requireOwnership',
      label: 'Vyžadovať vlastníctvo',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'showPoliticalExposure',
      label: 'Zobraziť politickú exponovanosť',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

moduleComponentRegistry.register({
  key: 'consents',
  name: 'Súhlasy a podpisy',
  description: 'Zber súhlasov a elektronických podpisov',
  category: 'legal',
  component: ConsentsWrapper,
  defaultConfiguration: {
    requireSignature: true,
    showGdprConsent: true
  },
  configurationSchema: [
    {
      field: 'requireSignature',
      label: 'Vyžadovať podpis',
      type: 'boolean',
      defaultValue: true
    },
    {
      field: 'showGdprConsent',
      label: 'Zobraziť GDPR súhlas',
      type: 'boolean',
      defaultValue: true
    }
  ]
});

// Export the registry for use in other components
export { moduleComponentRegistry };