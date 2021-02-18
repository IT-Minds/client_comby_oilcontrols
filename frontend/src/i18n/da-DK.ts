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
    statistics: "Rapporter"
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

  toast: {
    successful: "Vellykket",
    updateDebtor: "Opdater debtor",
    createTruck: "Opret vogn",
    createLocation: "Opret lokation",
    updateLocation: "Opdater lokation",
    updatePassword: "Opdater kodeord",
    updateRole: "Opdater rolle"
  },

  coupons: {
    invalidate: {
      invalidate: "Marker kupon ugyldig",
      confirm:
        "Er du sikker på, at du vil ugyldiggøre kuponen '{{coupon}}', denne handling kan ikke fortrydes?"
    }
  },

  truckMetaData: {
    driver: "Chauffør",
    startNumber: "Startudleveringsnummer",
    carNumber: "Bilnummer",
    carName: "Bilnavn",
    description: "Beskrivelse",
    tankSize: "Tankstørrelse",
    liters: "Liter",
    submit: "Indsend",
    formError: {
      driver: "Vælg en chauffør",
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
    comment: "Kommentar",
    comments: "Kommentarer:",
    selectAnImage: "Vælg et billede af tanklokationen",
    selectImage: "Vælg billede",
    reSelectImage: "Vælg et andet billede",
    tankNumber: "Tanknummer:",
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

  consumptionTable: {
    consumptionHistory: "Forbrugshistorik",
    address: "Adresse",
    fuelConsumed: "Brændstofforbrug",
    startDate: "Startdato",
    endDate: "Slutdato"
  },

  localePage: {
    title: "Rapporter",
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
      id: "ID"
    },
    addTruckTrigger: {
      addNewTruck: "Tilføj ny vogn"
    }
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
      complete: "Indsend påfyldning",
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
      selectCouponNumber: "Vælg kuponnummer:",
      selectFuelType: "Vælg brændstofstype",
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
      locationType: "Lokationstype",
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

  enums: {
    fuelType: {
      "0": "Benzin",
      "1": "Petroleum",
      "2": "Gasolin",
      "3": "Andet"
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
      "20": "Hent alle brugere"
    }
  }
};
