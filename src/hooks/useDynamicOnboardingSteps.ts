import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useOnboardingConfiguration } from './useOnboardingConfiguration';

// Fallback steps if configuration is not available
const getFallbackSteps = (t: any) => [
  {
    number: 0,
    title: t('steps:titles.contactInfo', 'Kontaktné údaje'),
    description: t('steps:descriptions.contactInfo', 'Základné kontaktné informácie'),
    step_key: 'contact_info'
  },
  {
    number: 1,
    title: t('steps:titles.companyInfo', 'Údaje o spoločnosti'),
    description: t('steps:descriptions.companyInfo', 'Informácie o právnickej osobe'),
    step_key: 'company_info'
  },
  {
    number: 2,
    title: t('steps:titles.businessLocations', 'Prevádzky'),
    description: t('steps:descriptions.businessLocations', 'Prevádzkové lokality a údaje'),
    step_key: 'business_locations'
  },
  {
    number: 3,
    title: t('steps:titles.deviceSelection', 'Zariadenia a služby'),
    description: t('steps:descriptions.deviceSelection', 'Výber technického vybavenia'),
    step_key: 'device_selection'
  },
  {
    number: 4,
    title: t('steps:titles.fees', 'Poplatky'),
    description: t('steps:descriptions.fees', 'Nastavenie poplatkov a provízie'),
    step_key: 'fees'
  },
  {
    number: 5,
    title: t('steps:titles.personsAndOwners', 'Osoby a vlastníci'),
    description: t('steps:descriptions.personsAndOwners', 'Splnomocnené osoby a skutoční vlastníci'),
    step_key: 'persons_and_owners'
  },
  {
    number: 6,
    title: t('steps:titles.consents', 'Súhlasy a podpis'),
    description: t('steps:descriptions.consents', 'Potvrdenie a podpis zmluvy'),
    step_key: 'consents'
  }
];

export const useDynamicOnboardingSteps = () => {
  const { t } = useTranslation('steps');
  const { data: config, isLoading, error } = useOnboardingConfiguration();

  const steps = useMemo(() => {
    // If configuration is loading or failed, use fallback
    if (isLoading || error || !config) {
      console.log('Using fallback steps:', { isLoading, error: !!error, hasConfig: !!config });
      return getFallbackSteps(t);
    }

    // Transform configuration steps to the expected format
    const configSteps = config.steps
      .filter(step => step.is_enabled)
      .sort((a, b) => a.position - b.position)
      .map((step, index) => ({
        number: index,
        title: step.title,
        description: step.description || '',
        step_key: step.step_key,
        configId: step.id
      }));

    console.log('Using configuration steps:', configSteps.length);
    return configSteps;
  }, [config, isLoading, error, t]);

  return {
    steps,
    isLoading,
    error,
    isUsingConfiguration: Boolean(config && !error),
    totalSteps: steps.length
  };
};