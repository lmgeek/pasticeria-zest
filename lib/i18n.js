'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import it from './locales/it.json'
import es from './locales/es.json'
import en from './locales/en.json'

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') || 'it' : 'it'

i18n.use(initReactI18next).init({
  resources: { it: { translation: it }, es: { translation: es }, en: { translation: en } },
  lng: savedLang,
  fallbackLng: 'it',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') localStorage.setItem('i18nextLng', lng)
})

export default i18n
