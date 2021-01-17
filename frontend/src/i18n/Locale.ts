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
}
