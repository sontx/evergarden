import en from './en-US';

export function getDict(locale) {
  if (locale === 'en') {
    return en;
  }
  return en;
}

export default {
  en: en
};
