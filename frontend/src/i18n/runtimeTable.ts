import { Locale } from "./Locale";

export const runTimeTable = (locale: string, table: Locale): Locale => {
  try {
    const { readdirSync, readFileSync } = require("fs");
    const { join } = require("path");

    const postsDirectory = join(process.cwd(), "src", "i18n");
    const filenames: string[] = readdirSync(postsDirectory);
    const localeFile = filenames.find(x => x === locale + ".json");

    let runTimeTable: Partial<Locale> = {};
    if (localeFile) {
      const filePath = join(postsDirectory, localeFile);
      const fileContents = readFileSync(filePath, "utf8");
      runTimeTable = JSON.parse(fileContents);
    }
    return { ...table, ...runTimeTable };
  } catch {
    return table;
  }
};
