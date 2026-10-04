import {routing} from '@/i18n/routing'

const OG_LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  ru: 'ru_RU',
}

export function getOgLocale(locale: string): string {
  return OG_LOCALE_MAP[locale] ?? locale.replace('-', '_')
}

export function getOgAlternateLocales(currentLocale: string): string[] {
  return routing.locales.filter(loc => loc !== currentLocale).map(getOgLocale)
}
