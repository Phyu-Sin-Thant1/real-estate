import React from 'react';
import { useI18n } from '../../context/I18nContext';

const LanguageToggle = () => {
  const { lang, setLang } = useI18n();

  return (
    <div className="inline-flex rounded-md border border-gray-300 bg-white shadow-sm" role="group" aria-label="Language selector">
      <button
        type="button"
        onClick={() => setLang('ko')}
        aria-pressed={lang === 'ko'}
        className={`px-3 py-2 text-sm font-medium rounded-l-md transition-colors ${
          lang === 'ko'
            ? 'bg-dabang-primary text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        KO
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-3 py-2 text-sm font-medium rounded-r-md border-l border-gray-300 transition-colors ${
          lang === 'en'
            ? 'bg-dabang-primary text-white'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;

