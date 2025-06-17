
import { useTranslation } from 'react-i18next';

export const useOnboardingSteps = () => {
  const { t } = useTranslation('steps');
  
  return [
    {
      number: 0,
      title: t('titles.contactInfo'),
      description: t('descriptions.contactInfo')
    },
    {
      number: 1,
      title: t('titles.companyInfo'),
      description: t('descriptions.companyInfo')
    },
    {
      number: 2,
      title: t('titles.businessLocations'),
      description: t('descriptions.businessLocations')
    },
    {
      number: 3,
      title: t('titles.deviceSelection'),
      description: t('descriptions.deviceSelection')
    },
    {
      number: 4,
      title: t('titles.fees'),
      description: t('descriptions.fees')
    },
    {
      number: 5,
      title: t('titles.personsAndOwners'),
      description: t('descriptions.personsAndOwners')
    },
    {
      number: 6,
      title: t('titles.consents'),
      description: t('descriptions.consents')
    }
  ];
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
