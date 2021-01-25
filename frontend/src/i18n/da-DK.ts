import { Locale } from "./Locale";

export const table: Locale = {
  locale: "Dansk",
  title: "Next.js 10 + Rosetta med indbygget i18n integration",
  subtitle: "Klik nedenfor for at opdatere din nuværende lokalitet 👇",
  profile: {
    button: "Tryk på mig!"
  },
  welcome: "Velkommen {{name}}! 😃",

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
  },

  actions: {
    cancel: "Annuller",
    delete: "Slet",
    invalidate: "Ugyldiggøre",
    submit: "Send"
  },

  coupons: {
    invalidate: {
      invalidate: "Marker kupon ugyldig",
      confirm:
        "Er du sikker på, at du vil ugyldiggøre kuponen '{{coupon}}', denne handling kan ikke fortrydes?"
    }
  },

  dailyTemperature: {
    selectRegion: "Vælg region",
    temperature: "Temperatur",
    selectDate: "Vælg en dato",
    formErrors: {
      selectRegion: "Vælg en temperatur",
      inputTemperature: "Indtast en temperatur"
    }
  },

  mytruck: {
    title: "Comby Olistying - Lastbil #{{id}}",
    heading: "Lastbil #{{id}}"
  }
};
