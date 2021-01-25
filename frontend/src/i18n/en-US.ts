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
    invalidate: "Invalidate",
    submit: "Submit"
  },

  coupons: {
    invalidate: {
      invalidate: "Invalidate Coupon",
      confirm:
        "Are you sure you want to invalidate coupon '{{coupon}}', this action can't be undone?"
    }
  },
  truckMetaData: {
    startNumber: "Start number",
    carNumber: "Car number",
    carName: "Car name",
    description: "Description",
    tankSize: "Tank size",
    formError: {
      carNumber: "Please enter a car number",
      carName: "Please specify a car name",
      description: "Please specify a description",
      tankSize: "Please specify a tank size"
    }
  },

  dailyTemperature: {
    selectRegion: "Select region",
    temperature: "Temperature",
    selectDate: "Select a date",
    formErrors: {
      selectRegion: "Please select a region",
      inputTemperature: "Please enter a temperature"
    }
  },

  mytruck: {
    title: "Comby OilControl - Truck {{id}}",
    heading: "Truck {{id}}"
  }
};
