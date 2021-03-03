const getLocale = async (locale: string): Promise<globalThis.Locale> => {
  const { dateFns = {} } = await import("../i18n/" + locale);
  return dateFns;
};

export default getLocale;
