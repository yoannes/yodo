import dayjs from "dayjs";
import en from "dayjs/locale/en";
import es from "dayjs/locale/es";
import ja from "dayjs/locale/ja";
import pt from "dayjs/locale/pt-br";
import list from "./words.json";
export type Word = keyof typeof list;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const userLanguage = navigator.language || navigator.userLanguage;
const options = ["pt", "en", "ja", "es"];
const _lang = userLanguage.split("-")[0];
export const lang = options.includes(_lang) ? _lang : "en";

function setLocale() {
  if (lang === "en") {
    dayjs.locale(en);
  } else if (lang === "pt") {
    dayjs.locale(pt);
  } else if (lang === "ja") {
    dayjs.locale(ja);
  } else if (lang === "es") {
    dayjs.locale(es);
  }
}

export function useI18n() {
  function t(word: Word, ...replace: (string | number | undefined)[]): string {
    if (!word) {
      return "";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _list: any = list;

    if (_list[word] && _list[word][lang]) {
      let msg = _list[word][lang];

      replace.forEach((w) => {
        msg = msg.replace("%s", w);
      });

      return msg.replace(/%s/g, "");
    }

    // eslint-disable-next-line no-console
    console.warn("Dict:", word);

    return `::${word}::`;
  }

  return { t, lang };
}

setLocale();
