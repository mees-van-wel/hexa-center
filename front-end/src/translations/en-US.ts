import { Translation } from "@/types/translation";

export default {
  common: {
    back: "Back",
    create: "Create",
    new: "New",
    save: "Save",
    saving: "Saving",
    saved: "Saved",
    number: "Number",
    delete: "Delete",
    name: "Name",
    areYouSure: "Are you sure?",
    yes: "Yes",
    no: "No",
    error: "Error",
    oops: "Something went wrong, try again later",
    today: "Today",
    week: "Week",
    workweek: "Workweek",
    day: "Day",
    show: "Show",
    hide: "Hide",
  },
  modules: {
    essentials: "Essentials",
    sales: "Sales",
    bookings: "Bookings",
  },
  entities: {
    relation: {
      name: {
        singular: "Relation",
        plural: "Relations",
      },
      keys: {
        type: "Type",
        name: "Name",
        emailAddress: "Email address",
        phoneNumber: "Phone number",
        dateOfBirth: "Date of birth",
        sex: "Sex",
        vatNumber: "VAT Number",
        cocNumber: "Chamber of Commerce Number",
        businessContactName: "Business Contact Name",
        businessContactEmailAddress: "Business Contact Email Address",
        businessContactPhoneNumber: "Business Contact Phone Number",
      },
      createdNotification: "Relation successfully created",
      deletedNotification: "Relation successfully deleted",
      isSelfAlert: {
        title: "You can't edit yourself here",
        message: "Your own personal details are editable only on the",
        button: "Profile Page",
      },
    },
    property: {
      name: {
        singular: "Property",
        plural: "Properties",
      },
      keys: {
        name: "Name",
        email: "Email",
        phoneNumber: "Phone number",
        street: "Street",
        houseNumber: "House number",
      },
      createdNotification: "Property successfully created",
      deletedNotification: "Property successfully deleted",
    },
    appointmentType: {
      name: {
        singular: "Appointment type",
        plural: "Appointment types",
      },
      keys: {
        name: "Name",
        start: "Start",
        end: "End",
        color: "Color",
        number: "Number",
      },
      duration: "Duration",
      hours: "Hours",
      minutes: "Minutes",
      appointmentDescription: "Appointment description",
      createdNotification: "Appointment type successfully created",
      deletedNotification: "Appointment type successfully deleted",
    },
    room: {
      name: {
        singular: "Room",
        plural: "Rooms",
      },
      keys: {
        name: "Name",
        price: "Price",
      },
      createdNotification: "Room successfully created",
      deletedNotification: "Room successfully deleted",
    },
    reservation: {
      name: {
        singular: "Reservation",
        plural: "Reservations",
      },
      keys: {
        roomId: "Room",
        customerId: "Customer",
        startDate: "Start date",
        endDate: "End date",
        priceOverride: "Price override",
        guestName: "Guest name",
        reservationNotes: "Reservation notes",
        invoiceNotes: "Invoice notes",
      },
      calendar: {
        noRooms: "No bookings found",
      },
      reservationCreated: "Reservation successfully created",
      roomDeleted: "Reservation successfully deleted",
      dateError: "Start date must be earlier than the end date.",
    },
    invoice: {
      singularName: "Invoice",
      pluralName: "Invoices",
      type: "Type",
      standard: "Invoice",
      quotation: "Quotation",
      credit: "Credit",
      final: "Final",
      customerName: "Customer",
      date: "Date",
      dueDate: "Due date",
      totalGrossAmount: "Amount",
      status: "Status",
      draft: "Draft",
      issued: "Issued",
      mailed: "Mailed",
      credited: "Credited",
      issuedMessage: "The invoice has been issued",
      mailedMessage: "The invoice has been mailed",
      creditedMessage: "The invoice has been credited",
    },
  },
  dates: {
    weekdayNames: {
      FRIDAY: "Friday",
      MONDAY: "Monday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
      THURSDAY: "Thursday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
    },
    weekdayNamesShort: {
      FRIDAY: "Fri",
      MONDAY: "Mon",
      SATURDAY: "Sat",
      SUNDAY: "Sun",
      THURSDAY: "Thu",
      TUESDAY: "Tue",
      WEDNESDAY: "Wed",
    },
    monthsLong: {
      JANUARY: "January",
      FEBRUARY: "February",
      MARCH: "March",
      APRIL: "April",
      MAY: "May",
      JUNE: "June",
      JULY: "July",
      AUGUST: "August",
      SEPTEMBER: "September",
      OCTOBER: "October",
      NOVEMBER: "November",
      DECEMBER: "December",
    },
    monthsShort: {
      JANUARY: "Jan",
      FEBRUARY: "Feb",
      MARCH: "Mar",
      APRIL: "Apr",
      MAY: "May",
      JUNE: "Jun",
      JULY: "Jul",
      AUGUST: "Aug",
      SEPTEMBER: "Sep",
      OCTOBER: "Oct",
      NOVEMBER: "Nov",
      DECEMBER: "Dec",
    },
  },
  authLayout: {
    help: "Help",
    version: "Version",
  },
  dashboardLayout: {
    avatar: {
      profile: "Profile",
      preferences: "Preferences",
      logout: "Logout",
    },
    home: "Home",
    appointmentTypes: "Appointment Types",
    properties: "Properties",
    roles: "Roles",
    reservations: "Reservations",
    rooms: "Rooms",
  },
  loginPage: {
    login: "Login",
    emailAddress: "Email address",
    sendEmailOtp: "Send Email Code",
    emailOtpSent: "If the entered email is correct, a code has been mailed to",
    emailRequiredError: "Email is required",
    emailFormatError: "Invalid or badly formatted email",
    sendAgain: "Send Again",
    otp: "Code",
    invalidOtpError: "The code is invalid",
    phoneNumber: "Phone number",
    sendPhoneOtp: "Receive SMS Code",
    phoneOtpSent:
      "If the entered phone number is correct, an SMS code has been sent to",
    phoneNumberRequiredError: "Phone number is required",
    phoneNumberFormatError: "Invalid or badly formatted phone number",
    rememberMeFor: "Remember me for",
    thisSessionOnly: {
      label: "This session only",
      description: "Best suited for public or shared devices.",
    },
    hours24: {
      label: "24 hours",
      description: "Ideal for brief tasks over multiple sessions.",
    },
    days7: {
      label: "7 days",
      description: "Great for personal devices with regular usage.",
    },
    days30: {
      label: "30 days",
      description: "Useful for secured primary devices.",
    },
    loggedInSuccess: "You're logged in successfully",
  },
  homePage: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    welcome: "Welcome",
    news: "News",
    title: "Home",
    read: "Read the full article",
  },
  preferencesPage: {
    title: "Preferences",
    name: "Preferences",
    system: "System",
    dateFormat: "Date format",
    timeFormat: "Time format",
    decimalSeparator: "Decimal separator",
    firstDayOfWeek: "First day of the week",
    language: "Language",
    theme: "Theme",
    timezone: "Timezone",
    storage: "Storage",
    timeNotation: "Time notation",
    workingHours: {
      name: "Working hours",
      invalid: "The given time is invalid",
      overlaps: "The given time overlaps",
    },
  },
  generic: {
    weekdayNames: {
      FRIDAY: "Friday",
      MONDAY: "Monday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
      THURSDAY: "Thursday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
    },
    authentication: "Authentication",
  },
  roomsPage: {
    price: "Price",
    noRooms: "Please add a room first",
    confirmDeleteModal: "If you continue this room will be deleted.",
    roomDeleted: "Room successfully deleted",
    roomCreated: "Room successfully created",
  },
  components: {
    address: {
      streetAndHouseNumber: "Street and House number",
      postalCode: "Postal code",
      city: "City",
      region: "Region",
      country: "Country",
    },
    metadata: {
      createdAt: "Created at",
      createdBy: "Created by",
      id: "Number",
      updatedAt: "Updated at",
      updatedBy: "Updated by",
      name: "Metadata",
    },
  },
  // exceptions: {
  //   DB_UNIQUE_CONSTRAINT: ({ entity, value, column }) =>
  //     `Another ${entity} with '${value}' as ${column} already exists.`,
  //   DB_KEY_CONSTRAINT: ({ depend, entity }) =>
  //     `There are one or more ${depend} using this ${entity}, please delete them first.`,
  // },
  constants: {
    sexes: {
      FEMALE: "Female",
      MALE: "Male",
      INTERSEX: "Intersex",
      OTHER: "Other",
    },
    relationTypes: {
      individual: "Individual",
      business: "Business",
    },
    dateFormats: {
      AUTO: "Auto",
      DMY: "DD-MM-YYYY",
      MDY: "MM/DD/YYYY",
    },
    separators: {
      AUTO: "Auto",
      DOT: "Dot",
      COMMA: "Comma",
    },
    timeFormats: {
      AUTO: "Auto",
      TWELVE: "12-hour (AM/PM)",
      TWENTYFOUR: "24-hour",
    },
    firstDaysOfTheWeek: {
      AUTO: "Auto",
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    },
    locales: {
      "en-US": "English (US)",
      "nl-NL": "Dutch - Nederlands",
    },
    themes: {
      DARK: "Dark",
      LIGHT: "Light",
      AUTO: "Auto",
    },
    weekdays: {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    },
    countries: {
      AD: "Andorra",
      AE: "United Arab Emirates",
      AF: "Afghanistan",
      AG: "Antigua and Barbuda",
      AI: "Anguilla",
      AL: "Albania",
      AM: "Armenia",
      AO: "Angola",
      AQ: "Antarctica",
      AR: "Argentina",
      AS: "American Samoa",
      AT: "Austria",
      AU: "Australia",
      AW: "Aruba",
      AX: "Åland",
      AZ: "Azerbaijan",
      BA: "Bosnia and Herzegovina",
      BB: "Barbados",
      BD: "Bangladesh",
      BE: "Belgium",
      BF: "Burkina Faso",
      BG: "Bulgaria",
      BH: "Bahrain",
      BI: "Burundi",
      BJ: "Benin",
      BL: "Saint Barthélemy",
      BM: "Bermuda",
      BN: "Brunei",
      BO: "Bolivia",
      BQ: "Bonaire, Sint Eustatius, and Saba",
      BR: "Brazil",
      BS: "Bahamas",
      BT: "Bhutan",
      BV: "Bouvet Island",
      BW: "Botswana",
      BY: "Belarus",
      BZ: "Belize",
      CA: "Canada",
      CC: "Cocos (Keeling) Islands",
      CD: "DR Congo",
      CF: "Central African Republic",
      CG: "Congo Republic",
      CH: "Switzerland",
      CI: "Ivory Coast",
      CK: "Cook Islands",
      CL: "Chile",
      CM: "Cameroon",
      CN: "China",
      CO: "Colombia",
      CR: "Costa Rica",
      CU: "Cuba",
      CV: "Cabo Verde",
      CW: "Curaçao",
      CX: "Christmas Island",
      CY: "Cyprus",
      CZ: "Czechia",
      DE: "Germany",
      DJ: "Djibouti",
      DK: "Denmark",
      DM: "Dominica",
      DO: "Dominican Republic",
      DZ: "Algeria",
      EC: "Ecuador",
      EE: "Estonia",
      EG: "Egypt",
      EH: "Western Sahara",
      ER: "Eritrea",
      ES: "Spain",
      ET: "Ethiopia",
      FI: "Finland",
      FJ: "Fiji",
      FK: "Falkland Islands",
      FM: "Micronesia",
      FO: "Faroe Islands",
      FR: "France",
      GA: "Gabon",
      GB: "United Kingdom",
      GD: "Grenada",
      GE: "Georgia",
      GF: "French Guiana",
      GG: "Guernsey",
      GH: "Ghana",
      GI: "Gibraltar",
      GL: "Greenland",
      GM: "The Gambia",
      GN: "Guinea",
      GP: "Guadeloupe",
      GQ: "Equatorial Guinea",
      GR: "Greece",
      GS: "South Georgia and South Sandwich Islands",
      GT: "Guatemala",
      GU: "Guam",
      GW: "Guinea-Bissau",
      GY: "Guyana",
      HK: "Hong Kong",
      HM: "Heard and McDonald Islands",
      HN: "Honduras",
      HR: "Croatia",
      HT: "Haiti",
      HU: "Hungary",
      ID: "Indonesia",
      IE: "Ireland",
      IL: "Israel",
      IM: "Isle of Man",
      IN: "India",
      IO: "British Indian Ocean Territory",
      IQ: "Iraq",
      IR: "Iran",
      IS: "Iceland",
      IT: "Italy",
      JE: "Jersey",
      JM: "Jamaica",
      JO: "Jordan",
      JP: "Japan",
      KE: "Kenya",
      KG: "Kyrgyzstan",
      KH: "Cambodia",
      KI: "Kiribati",
      KM: "Comoros",
      KN: "St Kitts and Nevis",
      KP: "North Korea",
      KR: "South Korea",
      KW: "Kuwait",
      KY: "Cayman Islands",
      KZ: "Kazakhstan",
      LA: "Laos",
      LB: "Lebanon",
      LC: "Saint Lucia",
      LI: "Liechtenstein",
      LK: "Sri Lanka",
      LR: "Liberia",
      LS: "Lesotho",
      LT: "Lithuania",
      LU: "Luxembourg",
      LV: "Latvia",
      LY: "Libya",
      MA: "Morocco",
      MC: "Monaco",
      MD: "Moldova",
      ME: "Montenegro",
      MF: "Saint Martin",
      MG: "Madagascar",
      MH: "Marshall Islands",
      MK: "North Macedonia",
      ML: "Mali",
      MM: "Myanmar",
      MN: "Mongolia",
      MO: "Macao",
      MP: "Northern Mariana Islands",
      MQ: "Martinique",
      MR: "Mauritania",
      MS: "Montserrat",
      MT: "Malta",
      MU: "Mauritius",
      MV: "Maldives",
      MW: "Malawi",
      MX: "Mexico",
      MY: "Malaysia",
      MZ: "Mozambique",
      NA: "Namibia",
      NC: "New Caledonia",
      NE: "Niger",
      NF: "Norfolk Island",
      NG: "Nigeria",
      NI: "Nicaragua",
      NL: "Netherlands",
      NO: "Norway",
      NP: "Nepal",
      NR: "Nauru",
      NU: "Niue",
      NZ: "New Zealand",
      OM: "Oman",
      PA: "Panama",
      PE: "Peru",
      PF: "French Polynesia",
      PG: "Papua New Guinea",
      PH: "Philippines",
      PK: "Pakistan",
      PL: "Poland",
      PM: "Saint Pierre and Miquelon",
      PN: "Pitcairn Islands",
      PR: "Puerto Rico",
      PS: "Palestine",
      PT: "Portugal",
      PW: "Palau",
      PY: "Paraguay",
      QA: "Qatar",
      RE: "Réunion",
      RO: "Romania",
      RS: "Serbia",
      RU: "Russia",
      RW: "Rwanda",
      SA: "Saudi Arabia",
      SB: "Solomon Islands",
      SC: "Seychelles",
      SD: "Sudan",
      SE: "Sweden",
      SG: "Singapore",
      SH: "Saint Helena",
      SI: "Slovenia",
      SJ: "Svalbard and Jan Mayen",
      SK: "Slovakia",
      SL: "Sierra Leone",
      SM: "San Marino",
      SN: "Senegal",
      SO: "Somalia",
      SR: "Suriname",
      SS: "South Sudan",
      ST: "São Tomé and Príncipe",
      SV: "El Salvador",
      SX: "Sint Maarten",
      SY: "Syria",
      SZ: "Eswatini",
      TC: "Turks and Caicos Islands",
      TD: "Chad",
      TF: "French Southern Territories",
      TG: "Togo",
      TH: "Thailand",
      TJ: "Tajikistan",
      TK: "Tokelau",
      TL: "Timor-Leste",
      TM: "Turkmenistan",
      TN: "Tunisia",
      TO: "Tonga",
      TR: "Turkey",
      TT: "Trinidad and Tobago",
      TV: "Tuvalu",
      TW: "Taiwan",
      TZ: "Tanzania",
      UA: "Ukraine",
      UG: "Uganda",
      UM: "U.S. Outlying Islands",
      US: "United States",
      UY: "Uruguay",
      UZ: "Uzbekistan",
      VA: "Vatican City",
      VC: "St Vincent and Grenadines",
      VE: "Venezuela",
      VG: "British Virgin Islands",
      VI: "U.S. Virgin Islands",
      VN: "Vietnam",
      VU: "Vanuatu",
      WF: "Wallis and Futuna",
      WS: "Samoa",
      XK: "Kosovo",
      YE: "Yemen",
      YT: "Mayotte",
      ZA: "South Africa",
      ZM: "Zambia",
      ZW: "Zimbabwe",
    },
  },
} satisfies Translation;
