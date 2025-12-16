import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const STORAGE_KEY = 'tofu-lang';
const I18nContext = createContext({
  lang: 'ko',
  setLang: () => {},
  t: (key) => key,
});

const resolveKey = (dict, key, fallbackDict) => {
  if (!key) return '';
  const parts = key.split('.');
  let current = dict;
  for (const part of parts) {
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }
  if (typeof current === 'string') return current;

  if (fallbackDict) {
    let f = fallbackDict;
    for (const part of parts) {
      if (f && Object.prototype.hasOwnProperty.call(f, part)) {
        f = f[part];
      } else {
        f = undefined;
        break;
      }
    }
    if (typeof f === 'string') return f;
  }

  return key;
};

export const I18nProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'ko';
    return window.localStorage.getItem(STORAGE_KEY) || 'ko';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  const t = useCallback((key) => {
    const currentDict = translations[lang] || translations.en;
    const enDict = translations.en;
    return resolveKey(currentDict, key, enDict);
  }, [lang]);

  const setLang = useCallback((nextLang) => {
    setLangState(nextLang);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
    }),
    [lang, setLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);


