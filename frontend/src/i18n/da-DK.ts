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
    users: "Brugerstyring",
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

  truckMetaData: {
    startNumber: "Startudleveringsnummer",
    carNumber: "Bilnummer",
    carName: "Bilnavn",
    description: "Beskrivelse",
    tankSize: "Tankstørrelse",
    formError: {
      carNumber: "Indtast bilnummer",
      carName: "Indtast bilnavn",
      description: "Indtast en beskrivelse",
      tankSize: "Indtast tankstørrelse"
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

  camera: {
    takePicture: "Tag billede"
  },

  mytruck: {
    title: "Comby Olistying - Lastbil #{{id}}",
    heading: "Lastbil #{{id}}",
    tank: {
      current: "Nuværende Tank: ",
      liters: "{{liters}} liter",
      of: " af "
    },
    tankLevel: "",
    refuel: {
      trigger: "Påfyld tank",
      complete: "Indsend påfyldning"
    },
    refill: {
      selectCouponNumber: "Vælg kuponnummer:",
      selectFuelType: "Vælg brændstofstype:",
      fuelInTankAfterRefill: "Brændstof i tanken EFTER påfyldning:",
      fuelInTankBeforeRefill: "Brændstof i tanken FØR påfyldning",
      liters: "liter",
      isPartialFill: "Delvist påfyldning:",
      viewImage: "Vis billede",
      takeImage: "Tag billede",
      submit: "Indsend",
      image: "Billede",
      retakeImage: "Tag billedet igen",
      formErrors: {
        selectCoupons: "Vælg en gyldig kupon",
        selectFuel: "Vælg en brændstofstype",
        liters: "Indtast antal liter",
        imageIsNeeded: "Tag et billede"
      }
    },
    runlist: {
      locationType: "Lokationstype",
      address: "Adresse",
      agreementType: "Aftaletype",
      fuelType: "Brændstofstype",
      deadline: "Deadline"
    }
  },
  enums: {
    fuelType: {
      "0": "Benzin",
      "1": "Petroleum",
      "2": "Gasolin",
      "3": "Andet"
    }
  }
};
