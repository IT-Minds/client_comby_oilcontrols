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
