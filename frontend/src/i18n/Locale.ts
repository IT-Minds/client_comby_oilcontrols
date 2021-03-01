export interface Locale {
  locale: string;
  title: string;
  subtitle: string;
  profile: {
    button: string;
  };
  welcome: string;

  menu: {
    trucks: {
      trucks: string;
      overview: string;
      create: string;
    };
    locations: {
      locations: string;
      buildings: string;
      ships: string;
      freestands: string;
      create: string;
    };
    debtors: {
      debtors: string;
      overview: string;
      create: string;
    };
    temperature: {
      temperature: string;
    };
    users: string;
    statistics: string;
  };

  user: {
    editInfo: string;
    logout: string;
    theme: string;
    type: {
      switch: string;
      switchConfirm: string;
      DRIVER: string;
      OFFICE_WORKER: string;
    };
  };

  // meant for single actions like buttons where it just says "Delete"
  actions: {
    delete: string;
    cancel: string;
    invalidate: string;
    submit: string;
  };

  toast: {
    successful: string;
    updateDebtor: string;
    createTruck: string;
    createLocation: string;
    updateLocation: string;
    updatePassword: string;
    updateRole: string;
    createTemperature: string;
    deleteUser: string;
  };

  coupons: {
    invalidate: {
      invalidate: string;
      confirm: string;
      noMoreCoupons: string;
      close: string;
    };
  };

  truckMetaData: {
    driver: string;
    startNumber: string;
    carNumber: string;
    carName: string;
    description: string;
    tankSize: string;
    liters: string;
    submit: string;
    formError: {
      driver: string;
      carNumber: string;
      carName: string;
      description: string;
      tankSize: string;
    };
  };

  dailyTemperature: {
    addDailyTemperature: string;
    selectRegion: string;
    temperature: string;
    selectDate: string;
    degree: string;
    formErrors: {
      selectRegion: string;
      inputTemperature: string;
    };
  };

  camera: {
    takePicture: string;
  };

  fillingOverview: {
    type: string;
    date: string;
    truckId: string;
    start: string;
    end: string;
    coupon: string;
  };

  addCoupon: {
    enterCouponInterval: string;
    addPendingCoupons: string;
    availableCoupons: string;
    submitCoupons: string;
    formErrors: {
      validInterval: string;
    };
  };

  createRole: {
    roleName: string;
    roleAction: string;
    createRole: string;
    formErrors: {
      enterRoleName: string;
      selectActions: string;
    };
  };

  createUser: {
    userName: string;
    password: string;
    role: string;
    createUser: string;
    formErrors: {
      enterUsername: string;
      enterPassword: string;
      chooseRole: string;
    };
  };

  debtorTable: {
    debtorTable: string;
    debtorName: string;
    debtorId: string;
    unicontaId: string;
    debtorDetails: {
      overViewOfDebtor: string;
      name: string;
      accountNumber: string;
      blocked: string;
      yes: string;
      no: string;
      couponIsRequired: string;
    };
  };

  localeMetaData: {
    location: string;
    locationType: string;
    selectALocation: string;
    address: string;
    selectRefillSchedule: string;
    refillSchedule: string;
    daysBetweenRefill: string;
    numberOfDays: string;
    comment: string;
    comments: string;
    selectAnImage: string;
    selectImage: string;
    reSelectImage: string;
    bstNumber: string;
    tankCapacity: string;
    liters: string;
    minFuelAmount: string;
    dailyFuelConsumptionEstimate: string;
    selectFuelType: string;
    debtor: string;
    main: string;
    base: string;
    upcoming: string;
    selectDate: string;
    submit: string;
    formErrors: {
      selectLocationType: string;
      enterAddress: string;
      selectRefillSchedule: string;
      daysBetween: string;
      enterComment: string;
      selectAnImage: string;
      bstNumber: string;
      tankCapacity: string;
      minFuelAmount: string;
      dailyFuelConsumptionEstimate: string;
      allowedFuelType: string;
      selectDebtorId: string;
    };
  };

  locationHistory: {
    locationMetaChangesHistory: string;
    address: string;
    comments: string;
    regionId: string;
    schedule: string;
    timeOfChange: string;
  };

  locationList: {
    address: string;
    regionId: string;
    scheduleType: string;
    orderRefill: {
      chooseDate: string;
      orderRefill: string;
    };
  };

  login: {
    username: string;
    password: string;
    show: string;
    hide: string;
    login: string;
    formErrors: {
      enterUsername: string;
      enterPassword: string;
    };
  };

  refillHistoryTable: {
    refillHistory: string;
    deliveryTime: string;
    amount: string;
    truckId: string;
    coupon: string;
  };

  consumptionTable: {
    consumptionHistory: string;
    address: string;
    fuelConsumed: string;
    startDate: string;
    endDate: string;
  };

  localePage: {
    title: string;
    tableInterval: string;
    downloadHistory: string;
    download: string;
    infoText: string;
    selectRefillYear: string;
  };

  trucks: {
    truckOverview: string;
    overviewOfTruck: string;
    metaData: string;
    coupons: string;
    fuelingHistory: string;
    truckList: {
      truckName: string;
      truckDescription: string;
      driver: string;
    };
    addTruckTrigger: {
      addNewTruck: string;
    };
  };

  mytruck: {
    title: string;
    heading: string;
    tankLevel: string;
    tank: {
      current: string;
      liters: string;
      of: string;
    };
    refuel: {
      trigger: string;
      complete: string;
      selectFuelType: string;
      fillingAmount: string;
      cardNumber: string;
      date: string;
      formErrors: {
        selectAllowedFuelType: string;
        enterAmountFilled: string;
        enterCardNumber: string;
        chooseDate: string;
      };
    };
    refill: {
      refill: string;
      selectCouponNumber: string;
      selectFuelType: string;
      fuelInTankAfterRefill: string;
      fuelInTankBeforeRefill: string;
      liters: string;
      isPartialFill: string;
      viewImage: string;
      takeImage: string;
      submit: string;
      image: string;
      retakeImage: string;
      formErrors: {
        selectCoupons: string;
        selectFuel: string;
        liters: string;
        imageIsNeeded: string;
      };
    };
    runlist: {
      comments: string;
      debtorBlocked: string;
      bstNumber: string;
      address: string;
      agreementType: string;
      fuelType: string;
      deadline: string;
    };
  };

  users: {
    users: string;
    createUser: string;
    createRole: string;
    updateRole: string;
    administrateRoles: string;
    userDetailsTable: {
      userName: string;
      role: string;
      userDetailsModal: {
        manageUser: string;
        newPassword: string;
        updatePassword: string;
        password: string;
        repeatPassword: string;
        userRole: string;
        updateRole: string;
        hide: string;
        show: string;
        formErrors: {
          inputPassword: string;
          chooseARole: string;
        };
      };
      deleteUserModal: {
        deleteUserInfo: string;
        deleteUser: string;
      };
    };
  };

  filtering: {
    all: string;
    selectAll: string;
    filter: string;
  };

  debtors: {
    debtors: string;
  };

  locationOverview: {
    addNew: string;
    editLocation: string;
    location: string;
  };

  streetSelector: {
    selectStreet: string;
  };

  debtorSelector: {
    selectDebtor: string;
    noDebtor: string;
  };

  userRoleSelector: {
    selectUserRole: string;
  };

  userSelector: {
    selectUser: string;
  };

  truckSelector: {
    selectTruck: string;
  };

  regionSelector: {
    selectRegion: string;
    region: string;
  };

  enums: {
    fuelType: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
    interval: {
      0: string;
      1: string;
      2: string;
    };

    tankType: {
      0: string;
      1: string;
      2: string;
    };

    refillSchedule: {
      0: string;
      1: string;
      2: string;
    };

    action: {
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
      12: string;
      13: string;
      14: string;
      15: string;
      16: string;
      17: string;
      18: string;
      19: string;
      20: string;
      21: string;
      22: string;
      23: string;
      24: string;
      25: string;
    };
  };
}
