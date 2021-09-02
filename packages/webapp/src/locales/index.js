import en from "./en-US";

export function getDict(locale) {
  if (locale === "en") {
    return en;
  }
  return en;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  en: en,
};
