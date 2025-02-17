import translations from '../translations/translations.json';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const typedTranslations: Translations = translations;

export const getTranslation = (key: string): string => {
  const language = navigator.language.split('-')[0];
  const translation = typedTranslations[language] || typedTranslations.en;
  return translation[key] || key;
};