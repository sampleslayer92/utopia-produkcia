
import { useTranslation } from 'react-i18next';
import { useDynamicOnboardingSteps } from '@/hooks/useDynamicOnboardingSteps';

export const useOnboardingSteps = () => {
  const { steps } = useDynamicOnboardingSteps();
  return steps;
};

// Fallback for compatibility - can be removed after all components are updated
export const onboardingSteps = [
  {
    number: 0,
    title: "Kontaktné údaje",
    description: "Základné kontaktné informácie"
  },
  {
    number: 1,
    title: "Údaje o spoločnosti",
    description: "Informácie o právnickej osobe"
  },
  {
    number: 2,
    title: "Prevádzky",
    description: "Prevádzkové lokality a údaje"
  },
  {
    number: 3,
    title: "Zariadenia a služby",
    description: "Výber technického vybavenia"
  },
  {
    number: 4,
    title: "Poplatky",
    description: "Nastavenie poplatkov a provízie"
  },
  {
    number: 5,
    title: "Osoby a vlastníci",
    description: "Splnomocnené osoby a skutoční vlastníci"
  },
  {
    number: 6,
    title: "Súhlasy a podpis",
    description: "Potvrdenie a podpis zmluvy"
  }
];
