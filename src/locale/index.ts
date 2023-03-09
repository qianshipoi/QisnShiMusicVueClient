import { createI18n } from 'vue-i18n';

import en from './en-US';
import zh from './zh-CN';

const defaultLocale = localStorage.getItem('locale') || 'zh-CN';

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  allowComposition: true,
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
});

export default i18n;
