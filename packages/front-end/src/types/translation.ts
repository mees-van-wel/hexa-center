export type Translation = {
  common: {
    back: string;
    create: string;
    new: string;
    save: string;
    saving: string;
    saved: string;
    number: string;
    delete: string;
  };
  authLayout: {
    help: string;
    version: string;
  };
  dashboardLayout: {
    modules: {
      essentials: string;
      bookings: string;
    };
    avatar: {
      profile: string;
      preferences: string;
      logout: string;
    };
    home: string;
    properties: string;
    roles: string;
    users: string;
    reservations: string;
    rooms: string;
  };
  loginPage: {
    login: string;
    email: string;
    sendEmailOtp: string;
    emailOtpSent: string;
    emailRequiredError: string;
    emailFormatError: string;
    sendAgain: string;
    otp: string;
    invalidOtpError: string;
    phoneNumber: string;
    sendPhoneOtp: string;
    phoneOtpSent: string;
    phoneNumberRequiredError: string;
    phoneNumberFormatError: string;
    rememberMeFor: string;
    thisSessionOnly: {
      label: string;
      description: string;
    };
    hours24: {
      label: string;
      description: string;
    };
    days7: {
      label: string;
      description: string;
    };
    days30: {
      label: string;
      description: string;
    };
    loggedInSuccess: string;
  };
  roomsPage: {
    rooms: string;
    name: string;
    price: string;
  };
};

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Leaves<T> = T extends object
  ? T extends (...args: any[]) => any
    ? ""
    : {
        [K in keyof T]: Leaves<T[K]> extends infer R ? Join<K, R> : never;
      }[keyof T]
  : "";

type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : never
  : P extends keyof T
    ? T[P] extends string
      ? undefined
      : T[P] extends (params: infer Params) => string
        ? Params
        : never
    : never;

type PathTypes<T> = {
  [P in Leaves<T>]: PathValue<T, P>;
};

export type TranslationPaths = PathTypes<Translation>;
