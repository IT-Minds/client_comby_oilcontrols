import { Locale } from "./Locale";

export const table: Locale = {
  locale: "English",
  title: "Next.js 10 + Rosetta with native i18n integration",
  subtitle: "Click below to update your current locale 👇",
  profile: {
    button: "Press me!"
  },
  welcome: "Welcome {{name}}! 😃",

  menu: {
    trucks: { trucks: "Trucks", overview: "View Trucks", create: "Create new truck" },
    locations: {
      locations: "Locations",
      buildings: "Building overview",
      ships: "Ship overview",
      freestands: "Free-standing tank overview",
      create: "Create new location"
    },
    debtors: {
      debtors: "Debtors",
      overview: "View debtors",
      create: "Create new debtor"
    },
    statistics: "Statistics"
  },
  user: {
    editInfo: "Edit info",
    logout: "Logout",
    theme: "Change theme",
    type: {
      switch: "Switch user type",
      switchConfirm: "Choose your new user type",
      DRIVER: "Chauffeur",
      OFFICE_WORKER: "Office Worker"
    }
  },

  actions: {
    cancel: "Cancel",
    delete: "Delete",
    invalidate: "Invalidate"
  },

  coupons: {
    invalidate: {
      invalidate: "Invalidate Coupon",
      confirm:
        "Are you sure you want to invalidate coupon '{{coupon}}', this action can't be undone?"
    }
  }
};