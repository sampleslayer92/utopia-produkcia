
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
import authSK from './locales/sk/auth.json';
import authEN from './locales/en/auth.json';
import actionsSK from './locales/sk/actions.json';
import actionsEN from './locales/en/actions.json';
import pagesSK from './locales/sk/pages.json';
import pagesEN from './locales/en/pages.json';
import uiSK from './locales/sk/ui.json';
import uiEN from './locales/en/ui.json';

// Debug: Log the warehouse translations to verify they're loaded
console.log('🔍 [i18n Debug] Slovak warehouse translations loaded:', adminSK.warehouse);
console.log('🔍 [i18n Debug] Available warehouse keys:', Object.keys(adminSK.warehouse || {}));

const resources = {
  sk: {
    common: commonSK,
    steps: stepsSK,
    forms: formsSK,
    notifications: notificationsSK,
    help: helpSK,
    admin: adminSK,
    auth: authSK,
    actions: actionsSK,
    pages: pagesSK,
    ui: uiSK
  },
  en: {
    common: commonEN,
    steps: stepsEN,
    forms: formsEN,
    notifications: notificationsEN,
    help: helpEN,
    admin: adminEN,
    auth: authEN,
    actions: actionsEN,
    pages: pagesEN,
    ui: uiEN
  },
};

console.log('🔍 [i18n Debug] Resources registered:', Object.keys(resources));
console.log('🔍 [i18n Debug] Slovak admin namespace:', Object.keys(resources.sk.admin));

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sk', // default language
    fallbackLng: 'sk',
    debug: true, // Enable debug to see missing key warnings
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    ns: ['common', 'steps', 'forms', 'notifications', 'help', 'admin', 'auth', 'actions', 'pages', 'ui'],
    defaultNS: 'common',
    
    // Add debug handler to catch missing keys
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      console.warn(`🚨 [i18n Missing Key] Language: ${lngs}, Namespace: ${ns}, Key: ${key}, Fallback: ${fallbackValue}`);
    },
  });

export default i18n;
