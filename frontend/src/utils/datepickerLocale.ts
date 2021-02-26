import da from "date-fns/locale/da";
import en from "date-fns/locale/en-US";
import { useI18n } from "next-rosetta";

const getLocale = (): Locale => {
  const { t } = useI18n<Locale>();
  const language = t("locale");
  if (language == "Dansk") {
    return da;
  } else if (language == "English") {
    return en;
  }
};

export default getLocale;
