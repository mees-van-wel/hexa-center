import { CountryKey } from "@/constants/countries";
import { DateFormatKey } from "@/constants/dateFormats";
import { DecimalSeparatorKey } from "@/constants/decimalSeparators";
import { FirstDayOfTheWeekKey } from "@/constants/firstDayOfTheWeek";
import { Locale } from "@/constants/locales";
import { Sex } from "@/constants/sexes";
import { ThemeKey } from "@/constants/themes";
import { TimeFormatKey } from "@/constants/timeFormats";
import { Weekday } from "@/constants/weekdays";

export type Translation = {
  common: {
    back: string;
    create: string;
    edit: string;
    add: string;
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
    email: string;
    phone: string;
    useTemplate: string;
    values: string;
    apply: string;
    from: string;
    to: string;
    viewDetails: string;
    mail: string;
    remail: string;
    downloadPdf: string;
    print: string;
    total: string;
  };
  modules: {
    essentials: string;
    sales: string;
    bookings: string;
    system: string;
  };
  entities: {
    user: {
      singularName: string;
      pluralName: string;
      firstName: string;
      lastName: string;
      sex: string;
      birthDate: string;
      createdNotification: string;
      deletedNotification: string;
      isSelfAlertTitle: string;
      isSelfAlertMessage: string;
      isSelfAlertButton: string;
    };
    company: {
      singularName: string;
      pluralName: string;
      cocNumber: string;
      vatId: string;
      iban: string;
      swiftBic: string;
      createdNotification: string;
      deletedNotification: string;
    };
    appointmentType: {
      name: {
        singular: string;
        plural: string;
      };
      keys: {
        name: string;
        start: string;
        end: string;
        color: string;
        number: string;
      };
      duration: string;
      hours: string;
      minutes: string;
      appointmentDescription: string;
      deletedNotification: string;
      createdNotification: string;
    };
    room: {
      singularName: string;
      pluralName: string;
      price: string;
      createdNotification: string;
      deletedNotification: string;
    };
    reservation: {
      singularName: string;
      pluralName: string;
      roomId: string;
      customerId: string;
      startDate: string;
      endDate: string;
      priceOverride: string;
      guestName: string;
      reservationNotes: string;
      invoiceNotes: string;
      invoicePeriod: {
        name: string;
        create: string;
        succes: string;
      };
      calendar: {
        roomName: string;
        noRooms: string;
      };
      reservationCreated: string;
      roomDeleted: string;
      dateError: string;
      overlapError: string;
    };
    product: {
      singularName: string;
      pluralName: string;
      quantity: string;
      price: string;
      vatRate: string;
      revenueAccount: string;
      cycle: {
        name: string;
        oneTimeOnNext: string;
        oneTimeOnEnd: string;
        perNightThroughout: string;
        perNightOnEnd: string;
      };
      status: {
        name: string;
        notInvoiced: string;
        partiallyInvoiced: string;
        fullyInvoiced: string;
      };
      resetStatus: string;
      actions: string;
      edit: string;
      editSucces: string;
      add: string;
      addSucces: string;
      resetSucces: string;
      deleted: string;
      empty: string;
    };
    customer: {
      singularName: string;
      pluralName: string;
      cocNumber: string;
      vatId: string;
      contactPersonName: string;
      contactPersonEmail: string;
      contactPersonPhone: string;
      createdNotification: string;
      deletedNotification: string;
    };
    invoice: {
      singularName: string;
      pluralName: string;
      type: {
        name: string;
        standard: string;
        quotation: string;
        credit: string;
      };
      notes: string;
      creditInvoice: string;
      finalInvoice: string;
      credit: string;
      final: string;
      issue: string;
      customerName: string;
      date: string;
      dueDate: string;
      invoiceDate: string;
      totalGrossAmount: string;
      status: {
        name: string;
        draft: string;
        issued: string;
        credited: string;
      };
      mailed: string;
      deleted: string;
      issuedMessage: string;
      issuedSucces: string;
      issuedfailed: string;
      mailedMessage: string;
      mailedSucces: string;
      mailedFailed: string;
      creditedMessage: string;
      creditSucces: string;
      creditFailed: string;
      printDocumentAlert: string;
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
    phone: string;
    sendPhoneOtp: string;
    phoneOtpSent: string;
    phoneRequiredError: string;
    phoneFormatError: string;
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
  homePage: {
    name: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    welcome: string;
    news: string;
    title: string;
    read: string;
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
  invoicePage: {
    yourDetails: string;
    timeline: string;
    lines: {
      name: string;
      unitPrice: string;
      quantity: string;
      totalNetAmount: string;
      vat: string;
      totalGrossAmount: string;
    };
    totalRevenueThisYear: string;
    revenueThisYear: string;
    totalRevenueLastYear: string;
    revenueLastYear: string;
  };
  generic: {
    authentication: string;
  };
  roomsPage: {
    price: string;
    noRooms: string;
    confirmDeleteModal: string;
    roomDeleted: string;
    roomCreated: string;
  };
  screens: {
    integrationsPage: {
      singleName: string;
      pluralName: string;
    };
  };
  components: {
    table: {
      quickSearch: string;
    };
    address: {
      addressLineOne: string;
      addressLineTwo: string;
      city: string;
      region: string;
      postalCode: string;
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
