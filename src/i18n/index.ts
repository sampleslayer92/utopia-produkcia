
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Slovak translations
import skOnboarding from './locales/sk/onboarding.json';
import skCommon from './locales/sk/common.json';
import skNotifications from './locales/sk/notifications.json';
import skSteps from './locales/sk/steps.json';
import skUi from './locales/sk/ui.json';

// English translations
import enOnboarding from './locales/en/onboarding.json';
import enCommon from './locales/en/common.json';
import enNotifications from './locales/en/notifications.json';
import enSteps from './locales/en/steps.json';
import enUi from './locales/en/ui.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      sk: {
        translation: {
          ...skOnboarding,
          ...skCommon,
          ...skNotifications,
          ...skSteps,
          ...skUi
        }
      },
      en: {
        translation: {
          ...enOnboarding,
          ...enCommon,
          ...enNotifications,
          ...enSteps,
          ...enUi
        }
      }
    },
    lng: localStorage.getItem('language') || 'sk',
    fallbackLng: 'sk',
    
    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
