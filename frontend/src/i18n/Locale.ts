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

  coupons: {
    invalidate: {
      invalidate: string;
      confirm: string;
    };
  };

  truckMetaData: {
    startNumber: string;
    carNumber: string;
    carName: string;
    description: string;
    tankSize: string;
    liters: string;
    submit: string;
    formError: {
      carNumber: string;
      carName: string;
      description: string;
      tankSize: string;
    };
  };

  dailyTemperature: {
    selectRegion: string;
    temperature: string;
    selectDate: string;
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
      couponIsRequired: string;
    };
  };

  localeMetaData: {
    locationType: string;
    address: string;
    refillSchedule: string;
    daysBetweenRefill: string;
    comments: string;
    selectAnImage: string;
    tankNumber: string;
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
      tankNumber: string;
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

  trucks: {
    truckOverview: string;
    overviewOfTruck: string;
    metaData: string;
    coupons: string;
    fuelingHistory: string;
    truckList: {
      truckName: string;
      truckDescription: string;
      id: string;
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
      locationType: string;
      address: string;
      agreementType: string;
      fuelType: string;
      deadline: string;
    };
  };

  users: {
    userDetailsTable: {
      userName: string;
      role: string;
      userDetailsModal: {
        manageUser: string;
        newPassword: string;
        updatePassword: string;
        userRole: string;
        updateRole: string;
        hide: string;
        show: string;
        formErrors: {
          inputPassword: string;
          chooseARole: string;
        };
      };
    };
  };

  enums: {
    fuelType: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
  };
}
