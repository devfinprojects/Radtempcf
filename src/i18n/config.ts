/**
 * Internationalization (i18n) Configuration
 * Supports: English, Spanish, German, French, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, Russian
 */

export const languages = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  pt: 'Português',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी',
  ru: 'Русский',
} as const;

export const defaultLang = 'en' as const;

export const rtlLanguages = ['ar'] as const;

export type Lang = keyof typeof languages;

export function isRtl(lang: Lang): boolean {
  return rtlLanguages.includes(lang as typeof rtlLanguages[number]);
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}
