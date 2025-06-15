
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import commonSK from './locales/sk/common.json';
import commonEN from './locales/en/common.json';
import stepsSK from './locales/sk/steps.json';
import stepsEN from './locales/en/steps.json';
import formsSK from './locales/sk/forms.json';
import formsEN from './locales/en/forms.json';
import notificationsSK from './locales/sk/notifications.json';
import notificationsEN from './locales/en/notifications.json';
import helpSK from './locales/sk/help.json';
import helpEN from './locales/en/help.json';

const resources = {
  sk: {
    common: commonSK,
    steps: stepsSK,
    forms: formsSK,
    notifications: notificationsSK,
    help: helpSK,
  },
  en: {
    common: commonEN,
    steps: stepsEN,
    forms: formsEN,
    notifications: notificationsEN,
    help: helpEN,
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
