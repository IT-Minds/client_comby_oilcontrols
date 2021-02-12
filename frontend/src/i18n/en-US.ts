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
    users: "Users",
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
    liters: "Liter",
    submit: "Indsend",
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

  camera: {
    takePicture: "Tag billede"
  },

  fillingOverview: {
    type: "Type",
    date: "Dato",
    truckId: "Vogn ID",
    start: "Start",
    end: "Slut",
    coupon: "Kupon"
  },

  addCoupon: {
    enterCouponInterval: "Udfyld kuponinterval:",
    addPendingCoupons: "Tilføj ventende kuponner",
    availableCoupons: "Tilgængelige kuponner",
    submitCoupons: "Indsend kuponner",
    formErrors: {
      validInterval: "Indtast et gyldigt interval"
    }
  },

  createRole: {
    roleName: "Rollenavn",
    roleAction: "Rollehandling",
    createRole: "Opret rolle",
    formErrors: {
      enterRoleName: "Indtast et rollenavn",
      selectActions: "Vælg én eller flere handlinger"
    }
  },

  createUser: {
    userName: "Brugernavn",
    password: "Kodeord",
    role: "Rolle",
    createUser: "Opret bruger",
    formErrors: {
      enterUsername: "Indtast et brugernavn",
      enterPassword: "Indtast et kodeord",
      chooseRole: "Vælg en rolle"
    }
  },

  debtorTable: {
    debtorTable: "Debitortabel",
    debtorName: "Debitornavn",
    debtorId: "Debitor ID",
    unicontaId: "Uniconta ID",
    debtorDetails: {
      overViewOfDebtor: "Overblik over debitor {{debtor}}",
      name: "Navn:",
      accountNumber: "Kontonummer:",
      blocked: "Blokkeret:",
      couponIsRequired: "Kupon er påkrævet:"
    }
  },

  localeMetaData: {
    locationType: "Lokationstype:",
    address: "Adresse:",
    refillSchedule: "Genopfyldningsplan:",
    daysBetweenRefill: "Dage mellem genopfyldninger:",
    comments: "Kommentarer:",
    selectAnImage: "Vælg et billede a tanklokationen",
    tankNumber: "Tanknummer:",
    tankCapacity: "Tankkapacitet:",
    liters: "Liter",
    minFuelAmount: "Minimum brændstofmængde:",
    dailyFuelConsumptionEstimate: "Daglig forventet brændstofforbrug:",
    selectFuelType: "Vælg brændstoftype:",
    debtor: "Debitor",
    main: "Hoved",
    base: "Base",
    upcoming: "Kommende",
    selectDate: "Vælg en dato:",
    submit: "Indsend",
    formErrors: {
      selectLocationType: "Vælg en lokationstype",
      enterAddress: "Indtast en adresse",
      selectRefillSchedule: "Vælg en genopfyldningsplan",
      daysBetween: "Vælg dage mellem genopfyldninger",
      enterComment: "Angiv en kommentar",
      selectAnImage: "Vælg et billede",
      tankNumber: "Indtast tanknummer",
      tankCapacity: "Indtast tankkapacitet",
      minFuelAmount: "Indtast minimum brændstofmængde",
      dailyFuelConsumptionEstimate: "Indtast det forventede daglige brændstofforbrug",
      allowedFuelType: "Vælg en gyldig brændstoftype",
      selectDebtorId: "Vælg mindst én debtor ID"
    }
  },

  locationHistory: {
    locationMetaChangesHistory: "Lokationsmetaændringshistorik",
    address: "Adresse",
    comments: "Kommentarer",
    regionId: "Region ID",
    schedule: "Tidsplan",
    timeOfChange: "Ændringstidspunkt"
  },

  locationList: {
    address: "Adresse",
    regionId: "Region ID",
    scheduleType: "Tidsplanstype",
    orderRefill: {
      chooseDate: "Vælg en dato",
      orderRefill: "Bestil opfyldning"
    }
  },

  login: {
    username: "Brugernavn",
    password: "Kodeord",
    show: "Vis",
    hide: "Skjul",
    login: "Log ind",
    formErrors: {
      enterUsername: "Indtast et brugernavn",
      enterPassword: "Indtast et kodeord"
    }
  },

  refillHistoryTable: {
    refillHistory: "Påfyldningshistorik",
    deliveryTime: "Leveringstid",
    amount: "Mængde",
    truckId: "Vogn ID",
    coupon: "Kupon"
  },

  trucks: {
    truckOverview: "Vogn overblik",
    overviewOfTruck: "Overblik over vogn {{id}}",
    metaData: "Meta data",
    coupons: "Kuponner",
    fuelingHistory: "Påfyldningshistorik",
    truckList: {
      truckName: "Vognnavn",
      truckDescription: "Vognbeskrivelse",
      id: "ID"
    },
    addTruckTrigger: {
      addNewTruck: "Tilføj ny vogn"
    }
  },

  mytruck: {
    title: "Comby OilControl - Truck {{id}}",
    heading: "Truck {{id}}",
    tank: {
      current: "Current Tank: ",
      liters: "{{liters}} liters",
      of: " of "
    },
    tankLevel: "",
    refuel: {
      trigger: "Refuel tank",
      complete: "Submit refuel",
      selectFuelType: "Vælg brændstoftype:",
      fillingAmount: "Påfyldningsmængde (i liter):",
      cardNumber: "Kortnummer:",
      date: "Dato:",
      formErrors: {
        selectAllowedFuelType: "Vælg en gyldig brændstoftype",
        enterAmountFilled: "Indtast påfyldningsmængde",
        enterCardNumber: "Indtast kortnummer",
        chooseDate: "Vælg en dato"
      }
    },
    refill: {
      selectCouponNumber: "Select coupon number:",
      selectFuelType: "Select fuel type:",
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

  users: {
    userDetailsTable: {
      userName: "Brugernavn",
      role: "Rolle",
      userDetailsModal: {
        manageUser: "Administrer bruger {{user}}",
        newPassword: "Nyt kodeord",
        updatePassword: "Opdatér kodeord",
        userRole: "Brugerrolle",
        updateRole: "Opdatér rolle",
        hide: "Skjul",
        show: "Vis",
        formErrors: {
          inputPassword: "Udfyld et nyt kodeord og sørg for at de er ens",
          chooseARole: "Vælg en rolle"
        }
      }
    }
  },
  enums: {
    fuelType: {
      "0": "Oil",
      "1": "Petroleum",
      "2": "Gasoline",
      "3": "Other"
    }
  }
};
