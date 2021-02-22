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
    temperature: {
      temperature: "Temperaturer"
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

  toast: {
    successful: "Vellykket",
    updateDebtor: "Opdater debtor",
    createTruck: "Opret vogn",
    createLocation: "Opret lokation",
    updateLocation: "Opdater lokation",
    updatePassword: "Opdater kodeord",
    updateRole: "Opdater rolle",
    createTemperature: "Opret temperatur"
  },

  coupons: {
    invalidate: {
      invalidate: "Invalidate Coupon",
      confirm:
        "Are you sure you want to invalidate coupon '{{coupon}}', this action can't be undone?"
    }
  },

  truckMetaData: {
    driver: "Driver",
    startNumber: "Start number",
    carNumber: "Car number",
    carName: "Car name",
    description: "Description",
    tankSize: "Tank size",
    liters: "Liter",
    submit: "Submit",
    formError: {
      driver: "Please select a driver",
      carNumber: "Please enter a car number",
      carName: "Please specify a car name",
      description: "Please specify a description",
      tankSize: "Please specify a tank size"
    }
  },

  dailyTemperature: {
    addDailyTemperature: "Tilføj temperatur",
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
      yes: "Ja",
      no: "Nej",
      couponIsRequired: "Kupon er påkrævet:"
    }
  },

  localeMetaData: {
    location: "Lokation",
    locationType: "Lokationstype:",
    selectALocation: "Vælg en lokation",
    address: "Adresse:",
    selectRefillSchedule: "Vælg genopfyldningsplan",
    refillSchedule: "Genopfyldningsplan:",
    daysBetweenRefill: "Dage mellem genopfyldninger:",
    numberOfDays: "# dage",
    comment: "Kommentar",
    comments: "Kommentarer:",
    selectAnImage: "Vælg et billede af tanklokationen",
    selectImage: "Vælg billede",
    reSelectImage: "Vælg et andet billede",
    bstNumber: "B/S/T nummer:",
    tankCapacity: "Tankkapacitet:",
    liters: "Liter",
    minFuelAmount: "Minimum brændstofmængde:",
    dailyFuelConsumptionEstimate: "Daglig forventet brændstofforbrug:",
    selectFuelType: "Vælg brændstoftype",
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
      bstNumber: "Indtast B/S/T nummer",
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

  consumptionTable: {
    consumptionHistory: "Forbrugshistorik",
    address: "Adresse",
    fuelConsumed: "Brændstofforbrug",
    startDate: "Startdato",
    endDate: "Slutdato"
  },

  localePage: {
    title: "Reports",
    tableInterval: "Vælg interval",
    downloadHistory: "Download historik",
    download: "Download",
    infoText: "Vælg et påfyldningsår for at downloade historikken",
    selectRefillYear: "Vælg påfyldningsår"
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
      driver: "Driver"
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
      selectFuelType: "Select fuel type",
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
      comments: "Kommentarer",
      debtorBlocked: "Debitor blokkeret",
      bstNumber: "B/S/T nummer",
      address: "Adresse",
      agreementType: "Aftaletype",
      fuelType: "Brændstofstype",
      deadline: "Deadline"
    }
  },

  users: {
    users: "Brugere",
    createUser: "Opret bruger",
    createRole: "Opret rolle",
    userDetailsTable: {
      userName: "Brugernavn",
      role: "Rolle",
      userDetailsModal: {
        manageUser: "Administrer bruger {{user}}",
        newPassword: "Nyt kodeord",
        updatePassword: "Opdatér kodeord",
        password: "Kodeord",
        repeatPassword: "Gentag kodeord",
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

  locationOverview: {
    addNew: "Tilføj ny",
    editLocation: "Rediger lokation",
    location: "lokation"
  },

  streetSelector: {
    selectStreet: "Vælg en adresse"
  },

  debtorSelector: {
    selectDebtor: "Vælg debitor",
    noDebtor: "Ingen debitor"
  },

  userRoleSelector: {
    selectUserRole: "Vælg brugerrolle"
  },

  userSelector: {
    selectUser: "Vælg bruger"
  },

  truckSelector: {
    selectTruck: "Vælg vogn"
  },

  regionSelector: {
    region: "Region",
    selectRegion: "Vælg region"
  },

  enums: {
    fuelType: {
      "0": "Oil",
      "1": "Petroleum",
      "2": "Gasoline",
      "3": "Other"
    },
    interval: {
      "0": "Måned",
      "1": "Kvartal",
      "2": "År"
    },
    tankType: {
      "0": "Bygning",
      "1": "Skib",
      "2": "Tank"
    },
    refillSchedule: {
      "0": "Automatisk",
      "1": "Interval",
      "2": "Manuelt"
    },
    action: {
      "0": "Tildel kupon",
      "1": "Gem kuponbillede",
      "2": "Opdater kuponstatus",
      "3": "Hent kuponer",
      "4": "Sæt temperatur",
      "5": "Hent debitor",
      "6": "Hent lokationshistorik",
      "7": "Opret lokation",
      "8": "Opdater lokation",
      "9": "Hent lokation",
      "10": "Opret påfyldning",
      "11": "Bestil påfyldning",
      "12": "Hent påfyldninger",
      "13": "Hent adresser",
      "14": "Opret vognpåfyldning",
      "15": "Opret vogn",
      "16": "Opdater vogn",
      "17": "Hent vogne",
      "18": "Opdater vogne",
      "19": "Opdater brugere",
      "20": "Hent alle brugere",
      "21": "Juster debitor kuponkrav",
      "22": "Opret brugerroller",
      "23": "Opdater brugerroller",
      "24": "Opret brugere"
    }
  }
};
