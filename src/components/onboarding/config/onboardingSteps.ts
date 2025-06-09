
import { User, Building2, MapPin, CreditCard, Euro, Users, Shield, CheckCircle } from "lucide-react";
import { i18n } from "@/lib/i18n";

export const onboardingSteps = [
  {
    id: 'contactInfo',
    title: () => i18n.t('steps.contactInfo.title'),
    description: () => i18n.t('steps.contactInfo.description'),
    icon: User,
    component: 'ContactInfoStep'
  },
  {
    id: 'companyInfo',
    title: () => i18n.t('steps.companyInfo.title'),
    description: () => i18n.t('steps.companyInfo.description'),
    icon: Building2,
    component: 'CompanyInfoStep'
  },
  {
    id: 'businessLocation',
    title: () => i18n.t('steps.businessLocation.title'),
    description: () => i18n.t('steps.businessLocation.description'),
    icon: MapPin,
    component: 'BusinessLocationStep'
  },
  {
    id: 'deviceSelection',
    title: () => i18n.t('steps.deviceSelection.title'),
    description: () => i18n.t('steps.deviceSelection.description'),
    icon: CreditCard,
    component: 'DeviceSelectionStep'
  },
  {
    id: 'fees',
    title: () => i18n.t('steps.fees.title'),
    description: () => i18n.t('steps.fees.description'),
    icon: Euro,
    component: 'FeesStep'
  },
  {
    id: 'authorizedPersons',
    title: () => i18n.t('steps.authorizedPersons.title'),
    description: () => i18n.t('steps.authorizedPersons.description'),
    icon: Users,
    component: 'AuthorizedPersonsStep'
  },
  {
    id: 'actualOwners',
    title: () => i18n.t('steps.actualOwners.title'),
    description: () => i18n.t('steps.actualOwners.description'),
    icon: Shield,
    component: 'ActualOwnersStep'
  },
  {
    id: 'consents',
    title: () => i18n.t('steps.consents.title'),
    description: () => i18n.t('steps.consents.description'),
    icon: CheckCircle,
    component: 'ConsentsStep'
  }
];
