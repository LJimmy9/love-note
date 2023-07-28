import i18next from "i18next";
import common_en from "./translations/en/common.json";
import common_es from "./translations/es/common.json";
import common_cn from "./translations/cn/common.json";

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
      en: {
          common: common_en // 'common' is our custom namespace
      },
      es: {
          common: common_es
      },
      cn: {
        common: common_cn
      }
  },
});
export default i18next;