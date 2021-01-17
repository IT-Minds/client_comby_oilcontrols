import { Locale } from "./Locale";

export const table: Locale = {
  locale: "Kalaallisut",
  title: "Next.js 10 + Rosetta ujarak quilt i18n integration",
  subtitle: "Click oqarlunilu to update your current locale 👇",
  profile: {
    button: "Press me!"
  },
  welcome: "Tikilluarit {{name}}! 😃",

  menu: {
    trucks: { trucks: "Vogne", overview: "Se vogne", create: "Opret ny vogn" },
    locations: {
      locations: "Lokationer",
      buildings: "Oversigt af bygninger",
      ships: "Oversigt af skibe",
      freestands: "Oversigt af fritstående tank",
      create: "Opret ny lokation"
    },
    debtors: {
      overview: "Oversigt af debitorer",
      debtors: "Debitorer",
      create: "Opret ny debitor"
    },
    statistics: "Statestikker"
  },
  user: {
    editInfo: "Redigér info",
    logout: "Log ud",
    theme: "Skift tema",
    type: {
      switch: "Skift Brugertype",
      switchConfirm: "Vælg din nye brugertype",
      DRIVER: "Chauffør",
      OFFICE_WORKER: "Kontorpersonale"
    }
  }
};
