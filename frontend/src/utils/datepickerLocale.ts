import { useRouter } from "next/router";

const getLocale = async (): Promise<globalThis.Locale> => {
  const { locale } = useRouter();
  const { datefns = {} } = await require("../i18n/" + locale);
  return datefns;
};

export default getLocale;
