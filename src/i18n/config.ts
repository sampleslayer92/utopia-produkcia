
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonSK from './locales/sk/common.json';
import commonEN from './locales/en/common.json';
import stepsSK from './locales/sk/steps.json';
import stepsEN from './locales/en/steps.json';
import notificationsSK from './locales/sk/notifications.json';
import notificationsEN from './locales/en/notifications.json';
import helpSK from './locales/sk/help.json';
import helpEN from './locales/en/help.json';

// Import new form-specific translation files
import contactInfoEN from './locales/en/contact-info.json';
import companyInfoEN from './locales/en/company-info.json';
import addressEN from './locales/en/address.json';
import businessLocationEN from './locales/en/business-location.json';
import deviceSelectionEN from './locales/en/device-selection.json';
import feesEN from './locales/en/fees.json';
import authorizedPersonsEN from './locales/en/authorized-persons.json';
import actualOwnersEN from './locales/en/actual-owners.json';
import consentsEN from './locales/en/consents.json';

const resources = {
  sk: {
    common: commonSK,
    steps: stepsSK,
    notifications: notificationsSK,
    help: helpSK,
  },
  en: {
    common: commonEN,
    steps: stepsEN,
    notifications: notificationsEN,
    help: helpEN,
    // Merge all form translations into the forms namespace
    forms: {
      ...contactInfoEN,
      ...companyInfoEN,
      ...addressEN,
      ...businessLocationEN,
      ...deviceSelectionEN,
      ...feesEN,
      ...authorizedPersonsEN,
      ...actualOwnersEN,
      ...consentsEN,
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sk', // default language
    fallbackLng: 'sk',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    ns: ['common', 'steps', 'forms', 'notifications', 'help'],
    defaultNS: 'common',
  });

export default i18n;
