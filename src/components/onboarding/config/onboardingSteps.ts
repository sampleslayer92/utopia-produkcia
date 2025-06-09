
import { User, Building2, MapPin, CreditCard, Euro, Users, Shield, CheckCircle } from "lucide-react";

export const onboardingSteps = [
  {
    id: 'contactInfo',
    title: 'Kontaktné informácie',
    description: 'Zadajte vaše základné kontaktné údaje pre vytvorenie zmluvy',
    icon: User,
    component: 'ContactInfoStep'
  },
  {
    id: 'companyInfo',
    title: 'Údaje o spoločnosti',
    description: 'Zadajte základné informácie o vašej spoločnosti',
    icon: Building2,
    component: 'CompanyInfoStep'
  },
  {
    id: 'businessLocation',
    title: 'Miesta podnikania',
    description: 'Definujte miesta kde budete vykonávať podnikateľskú činnosť',
    icon: MapPin,
    component: 'BusinessLocationStep'
  },
  {
    id: 'deviceSelection',
    title: 'Výber zariadení',
    description: 'Vyberte potrebné zariadenia a služby',
    icon: CreditCard,
    component: 'DeviceSelectionStep'
  },
  {
    id: 'fees',
    title: 'Poplatky',
    description: 'Nastavte poplatky a podmienky',
    icon: Euro,
    component: 'FeesStep'
  },
  {
    id: 'authorizedPersons',
    title: 'Oprávnené osoby',
    description: 'Zadajte osoby oprávnené konať za spoločnosť',
    icon: Users,
    component: 'AuthorizedPersonsStep'
  },
  {
    id: 'actualOwners',
    title: 'Skutoční majitelia',
    description: 'Identifikujte skutočných majiteľov spoločnosti',
    icon: Shield,
    component: 'ActualOwnersStep'
  },
  {
    id: 'consents',
    title: 'Súhlasy',
    description: 'Potvrďte súhlasy a dokončite registráciu',
    icon: CheckCircle,
    component: 'ConsentsStep'
  }
];
