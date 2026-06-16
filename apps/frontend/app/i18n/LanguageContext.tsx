import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function deepMerge<T>(base: T, override: T): T {
  if (Array.isArray(override)) return override;
  if (override && typeof override === 'object' && base && typeof base === 'object') {
    const result = { ...(base as Record<string, unknown>) };
    for (const key in override) {
      if (Object.prototype.hasOwnProperty.call(override, key)) {
        result[key] = deepMerge(
          (base as Record<string, unknown>)[key],
          (override as Record<string, unknown>)[key]
        );
      }
    }
    return result as T;
  }
  return override === undefined ? base : override;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('viking-quest-language');
    return (saved as Language) || 'et';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('viking-quest-language', lang);
  };

  const t = useMemo(
    () => deepMerge(translations.en, translations[language]),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
