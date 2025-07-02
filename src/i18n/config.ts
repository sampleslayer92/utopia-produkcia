
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
import adminSK from './locales/sk/admin.json';
import adminEN from './locales/en/admin.json';
import landingSK from './locales/sk/landing.json';
import landingEN from './locales/en/landing.json';

const resources = {
  sk: {
    common: commonSK,
    steps: stepsSK,
    forms: formsSK,
    notifications: notificationsSK,
    help: helpSK,
    admin: adminSK,
    landing: landingSK,
  },
  en: {
    common: commonEN,
    steps: stepsEN,
    forms: formsEN,
    notifications: notificationsEN,
    help: helpEN,
    admin: adminEN,
    landing: landingEN,
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
    
    ns: ['common', 'steps', 'forms', 'notifications', 'help', 'admin', 'landing'],
    defaultNS: 'common',
  });

export default i18n;
