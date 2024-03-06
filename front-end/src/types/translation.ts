import { CountryKey } from "@/constants/countries";
import { DateFormatKey } from "@/constants/dateFormats";
import { DecimalSeparatorKey } from "@/constants/decimalSeparators";
import { FirstDayOfTheWeekKey } from "@/constants/firstDayOfTheWeek";
import { Locale } from "@/constants/locales";
import { RelationType } from "@/constants/relationTypes";
import { Sex } from "@/constants/sexes";
import { ThemeKey } from "@/constants/themes";
import { TimeFormatKey } from "@/constants/timeFormats";
import { Weekday } from "@/constants/weekdays";

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
    name: string;
    areYouSure: string;
    yes: string;
    no: string;
    error: string;
    oops: string;
    today: string;
    week: string;
    workweek: string;
    day: string;
    show: string;
    hide: string;
  };
  modules: {
    essentials: string;
    sales: string;
    bookings: string;
  };
  entities: {
    relation: {
      name: {
        singular: string;
        plural: string;
      };
      keys: {
        type: string;
        name: string;
        emailAddress: string;
        phoneNumber: string;
        dateOfBirth: string;
        sex: string;
        vatNumber: string;
        cocNumber: string;
        businessContactName: string;
        businessContactEmailAddress: string;
        businessContactPhoneNumber: string;
      };
      createdNotification: string;
      deletedNotification: string;
      isSelfAlert: {
        title: string;
        message: string;
        button: string;
      };
    };
    room: {
      name: {
        singular: string;
        plural: string;
      };
      keys: {
        name: string;
        price: string;
      };
      createdNotification: string;
      deletedNotification: string;
    };
    reservation: {
      name: {
        singular: string;
        plural: string;
      };
      keys: {
        roomId: string;
        customerId: string;
        startDate: string;
        endDate: string;
        priceOverride: string;
        guestName: string;
        reservationNotes: string;
        invoiceNotes: string;
      };
      calendar: {
        noRooms: string;
      };
      reservationCreated: string;
      roomDeleted: string;
      dateError: string;
    };
    invoice: {
      singularName: string;
      pluralName: string;
      type: string;
      standard: string;
      quotation: string;
      credit: string;
      final: string;
      customerName: string;
      date: string;
      dueDate: string;
      totalGrossAmount: string;
      status: string;
      draft: string;
      issued: string;
      mailed: string;
      credited: string;
      issuedMessage: string;
      mailedMessage: string;
      creditedMessage: string;
    };
  };
  dates: {
    weekdayNames: {
      FRIDAY: string;
      MONDAY: string;
      SATURDAY: string;
      SUNDAY: string;
      THURSDAY: string;
      TUESDAY: string;
      WEDNESDAY: string;
    };
    weekdayNamesShort: {
      FRIDAY: string;
      MONDAY: string;
      SATURDAY: string;
      SUNDAY: string;
      THURSDAY: string;
      TUESDAY: string;
      WEDNESDAY: string;
    };
    monthsLong: {
      JANUARY: string;
      FEBRUARY: string;
      MARCH: string;
      APRIL: string;
      MAY: string;
      JUNE: string;
      JULY: string;
      AUGUST: string;
      SEPTEMBER: string;
      OCTOBER: string;
      NOVEMBER: string;
      DECEMBER: string;
    };
    monthsShort: {
      JANUARY: string;
      FEBRUARY: string;
      MARCH: string;
      APRIL: string;
      MAY: string;
      JUNE: string;
      JULY: string;
      AUGUST: string;
      SEPTEMBER: string;
      OCTOBER: string;
      NOVEMBER: string;
      DECEMBER: string;
    };
  };
  authLayout: {
    help: string;
    version: string;
  };
  dashboardLayout: {
    avatar: {
      profile: string;
      preferences: string;
      logout: string;
    };
    home: string;
    properties: string;
    roles: string;
    reservations: string;
    rooms: string;
  };
  loginPage: {
    login: string;
    emailAddress: string;
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
  preferencesPage: {
    title: string;
    name: string;
    system: string;
    dateFormat: string;
    timeFormat: string;
    decimalSeparator: string;
    firstDayOfWeek: string;
    language: string;
    theme: string;
    timezone: string;
    timeNotation: string;
    storage: string;
    workingHours: {
      name: string;
      invalid: string;
      overlaps: string;
    };
  };
  generic: {
    weekdayNames: {
      FRIDAY: string;
      MONDAY: string;
      SATURDAY: string;
      SUNDAY: string;
      THURSDAY: string;
      TUESDAY: string;
      WEDNESDAY: string;
    };
    authentication: string;
  };
  roomsPage: {
    price: string;
    noRooms: string;
    confirmDeleteModal: string;
    roomDeleted: string;
    roomCreated: string;
  };
  components: {
    address: {
      streetAndHouseNumber: string;
      postalCode: string;
      city: string;
      region: string;
      country: string;
    };
    metadata: {
      createdAt: string;
      createdBy: string;
      id: string;
      updatedAt: string;
      updatedBy: string;
      name: string;
    };
  };
  // exceptions: {
  //   DB_UNIQUE_CONSTRAINT: ({
  //     entity,
  //     value,
  //     column,
  //   }: {
  //     entity: string;
  //     column: string;
  //     value: string;
  //   }) => string;
  //   DB_KEY_CONSTRAINT: ({
  //     depend,
  //     entity,
  //   }: {
  //     depend: string;
  //     entity: string;
  //   }) => string;
  // };
  constants: {
    sexes: Record<Sex, string>;
    relationTypes: Record<RelationType, string>;
    dateFormats: Record<DateFormatKey, string>;
    separators: Record<DecimalSeparatorKey, string>;
    timeFormats: Record<TimeFormatKey, string>;
    firstDaysOfTheWeek: Record<FirstDayOfTheWeekKey, string>;
    weekdays: Record<Weekday, string>;
    locales: Record<Locale, string>;
    themes: Record<ThemeKey, string>;
    countries: Record<CountryKey, string>;
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
