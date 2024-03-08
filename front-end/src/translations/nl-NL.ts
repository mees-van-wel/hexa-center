import { Translation } from "@/types/translation";

export default {
  common: {
    back: "Terug",
    create: "Aanmaken",
    new: "Nieuw",
    save: "Opslaan",
    saving: "Opslaan",
    saved: "Opgeslagen",
    number: "Nummer",
    delete: "Verwijderen",
    name: "Name",
    areYouSure: "Weet je het zeker?",
    yes: "Ja",
    no: "Nee",
    error: "Fout",
    oops: "Er is iets fout gegaan, probeer het later opnieuw",
    today: "Vandaag",
    week: "Week",
    workweek: "Werkweek",
    day: "Dag",
    show: "Weergeven",
    hide: "Verbergen",
  },
  modules: {
    essentials: "Essentieel",
    sales: "Verkoop",
    bookings: "Bookingen",
  },
  entities: {
    relation: {
      name: {
        singular: "Relatie",
        plural: "Relaties",
      },
      keys: {
        type: "Type",
        name: "Naam",
        emailAddress: "E-mailadres",
        phoneNumber: "Telefoonnummer",
        dateOfBirth: "Geboortedatum",
        sex: "Sekse",
        vatNumber: "BTW-nummer",
        cocNumber: "Kamer van Koophandel-nummer",
        businessContactName: "Naam contactpersoon",
        businessContactEmailAddress: "E-mailadres contactpersoon",
        businessContactPhoneNumber: "Telefoonnummer contactpersoon",
      },
      createdNotification: "Relatie succesvol aangemaakt",
      deletedNotification: "Relatie succesvol verwijderd",
      isSelfAlert: {
        title: "Je kunt jezelf hier niet bewerken",
        message: "Je eigen persoonlijke gegevens zijn alleen bewerkbaar op de",
        button: "Profielpagina",
      },
    },
    room: {
      name: {
        singular: "Kamer",
        plural: "Kamers",
      },
      keys: {
        name: "Naam",
        price: "Prijs",
      },
      createdNotification: "Kamer succesvol aangemaakt",
      deletedNotification: "Kamer succesvol verwijderd",
    },
    reservation: {
      name: {
        singular: "Reservatie",
        plural: "Reservaties",
      },
      keys: {
        roomId: "Kamer",
        customerId: "Klant",
        startDate: "Startdatum",
        endDate: "Einddatum",
        priceOverride: "Aangepaste prijs",
        guestName: "Naam gast",
        reservationNotes: "Reserveringsnotities",
        invoiceNotes: "Factuurnotities",
      },
      calendar: {
        roomName: "Kamer naam",
        noRooms: "Geen Boekingen gevonden",
      },
      reservationCreated: "Reservatie succesvol aangemaakt",
      roomDeleted: "Reservatie succesvol verwijderd",
      dateError: "De startdatum moet eerder zijn dan de einddatum.",
      overlapError: "De kamer is al geboekt op deze datum, wil je doorgaan?",
    },
    invoice: {
      singularName: "Factuur",
      pluralName: "Facturen",
      type: "Type",
      standard: "Factuur",
      quotation: "Offerte",
      credit: "Creditfactuur",
      final: "Eindfactuur",
      customerName: "Klant",
      date: "Datum",
      dueDate: "Betalingsvervaldatum",
      totalGrossAmount: "Bedrag",
      status: "Status",
      draft: "Concept",
      issued: "Definitief",
      mailed: "Gemaild",
      credited: "Gecrediteerd",
      issuedMessage: "De factuur is definitief gemaakt",
      mailedMessage: "De factuur is gemailed",
      creditedMessage: "De factuur is gecrediteerd",
    },
  },
  dates: {
    weekdayNames: {
      FRIDAY: "Vrijdag",
      MONDAY: "Maandag",
      SATURDAY: "Zaterdag",
      SUNDAY: "Zondag",
      THURSDAY: "Donderdag",
      TUESDAY: "Dinsdag",
      WEDNESDAY: "Woensdag",
    },
    weekdayNamesShort: {
      FRIDAY: "Vr",
      MONDAY: "Ma",
      SATURDAY: "Za",
      SUNDAY: "Zo",
      THURSDAY: "Do",
      TUESDAY: "Di",
      WEDNESDAY: "Wo",
    },
    monthsLong: {
      JANUARY: "Januari",
      FEBRUARY: "Februari",
      MARCH: "Maart",
      APRIL: "April",
      MAY: "Mei",
      JUNE: "Juni",
      JULY: "Juli",
      AUGUST: "Augustus",
      SEPTEMBER: "September",
      OCTOBER: "Oktober",
      NOVEMBER: "November",
      DECEMBER: "December",
    },
    monthsShort: {
      JANUARY: "Jan",
      FEBRUARY: "Feb",
      MARCH: "Mar",
      APRIL: "Apr",
      MAY: "Mei",
      JUNE: "Jun",
      JULY: "Jul",
      AUGUST: "Aug",
      SEPTEMBER: "Sep",
      OCTOBER: "Okt",
      NOVEMBER: "Nov",
      DECEMBER: "Dec",
    },
  },
  authLayout: {
    help: "Help",
    version: "Versie",
  },
  dashboardLayout: {
    avatar: {
      profile: "Profile",
      preferences: "Preferences",
      logout: "Logout",
    },
    home: "Home",
    properties: "Vestigingen",
    roles: "Rollen",
    reservations: "Reservaties",
    rooms: "Kamers",
  },
  loginPage: {
    login: "Inloggen",
    emailAddress: "E-mailadres",
    sendEmailOtp: "Verstuur E-mailcode",
    emailOtpSent:
      "Als het ingevoerde e-mailadres correct is, is er een code verzonden naar",
    emailRequiredError: "E-mailadres is verplicht",
    emailFormatError: "Ongeldig of verkeerd geformatteerd e-mailadres",
    sendAgain: "Opnieuw versturen",
    otp: "Code",
    invalidOtpError: "De code is ongeldig",
    phoneNumber: "Telefoonnummer",
    sendPhoneOtp: "Ontvang SMS Code",
    phoneOtpSent:
      "Als het ingevoerde telefoonnummer correct is, is er een SMS-code verzonden naar",
    phoneNumberRequiredError: "Telefoonnummer is verplicht",
    phoneNumberFormatError: "Ongeldig of verkeerd geformatteerd telefoonnummer",
    rememberMeFor: "Onthoud mij voor",
    thisSessionOnly: {
      label: "Alleen deze sessie",
      description: "Het beste geschikt voor openbare of gedeelde apparaten.",
    },
    hours24: {
      label: "24 uur",
      description: "Ideaal voor korte taken over meerdere sessies.",
    },
    days7: {
      label: "7 dagen",
      description:
        "Geweldig voor persoonlijke apparaten met regelmatig gebruik.",
    },
    days30: {
      label: "30 dagen",
      description: "Handig voor beveiligde primaire apparaten.",
    },
    loggedInSuccess: "U bent succesvol ingelogd",
  },
  homePage: {
    goodMorning: "Goedemorgen",
    goodAfternoon: "Goedemiddag",
    goodEvening: "Goedenavond",
    welcome: "Welkom",
    news: "Nieuws",
    title: "Home",
    read: "Lees het volledige artikel",
  },
  preferencesPage: {
    title: "Voorkeuren",
    name: "Instellingen",
    system: "Systeem",
    dateFormat: "Datumnotatie",
    timeFormat: "Tijdsindeling",
    decimalSeparator: "Decimaalteken",
    firstDayOfWeek: "Eerste dag van de week",
    language: "Taal",
    theme: "Thema",
    timezone: "Tijdzone",
    storage: "Opslag",
    timeNotation: "Tijdsindeling",
    workingHours: {
      name: "Werkuren",
      invalid: "De gegeven tijd is ongeldig",
      overlaps: "De gegeven tijd overlapt",
    },
  },
  generic: {
    weekdayNames: {
      FRIDAY: "Vrijdag",
      MONDAY: "Maandag",
      SATURDAY: "Zaterdag",
      SUNDAY: "Zondag",
      THURSDAY: "Donderdag",
      TUESDAY: "Dinsdag",
      WEDNESDAY: "Woensdag",
    },
    authentication: "Authenticatie",
  },
  roomsPage: {
    price: "Prijs",
    noRooms: "Voeg eerst een kamer toe",
    confirmDeleteModal: "Als u doorgaat wordt deze kamer verwijdert.",
    roomDeleted: "Kamer succesvol verwijderd",
    roomCreated: "Kamer succesvol aangemaakt",
  },
  components: {
    address: {
      streetAndHouseNumber: "Straat en huisnummer",
      postalCode: "Postcode",
      city: "Stad",
      region: "Provincie",
      country: "Land",
    },
    metadata: {
      createdAt: "Gemaakt op",
      createdBy: "Gemaakt door",
      id: "Nummer",
      updatedAt: "Bijgewerkt op",
      updatedBy: "Bijgewerkt door",
      name: "Metagegevens",
    },
  },
  // exceptions: {
  //   DB_UNIQUE_CONSTRAINT: ({ entity, value, column }) =>
  //     `Een ${entity} met '${value}' als ${column} bestaat al.`,
  //   DB_KEY_CONSTRAINT: ({ depend, entity }) =>
  //     `Er zijn een of meerdere ${depend} die deze ${entity} gebruiken, verwijder ze eerst.`,
  // },
  constants: {
    sexes: {
      FEMALE: "Vrouwelijk",
      MALE: "Mannelijk",
      INTERSEX: "Intersekse",
      OTHER: "Overig",
    },
    relationTypes: {
      individual: "Individu",
      business: "Bedrijf",
    },
    dateFormats: {
      AUTO: "Auto",
      DMY: "DD-MM-YYYY",
      MDY: "MM/DD/YYYY",
    },
    separators: {
      AUTO: "Auto",
      DOT: "Punt",
      COMMA: "Komma",
    },
    timeFormats: {
      AUTO: "Auto",
      TWELVE: "12-uur (AM/PM)",
      TWENTYFOUR: "24-uur",
    },
    firstDaysOfTheWeek: {
      AUTO: "Auto",
      MONDAY: "Maandag",
      TUESDAY: "Dinsdag",
      WEDNESDAY: "Woensdag",
      THURSDAY: "Donderdag",
      FRIDAY: "Vrijdag",
      SATURDAY: "Zaterdag",
      SUNDAY: "Zondag",
    },
    weekdays: {
      MONDAY: "Maandag",
      TUESDAY: "Dinsdag",
      WEDNESDAY: "Woensdag",
      THURSDAY: "Donderdag",
      FRIDAY: "Vrijdag",
      SATURDAY: "Zaterdag",
      SUNDAY: "Zondag",
    },
    locales: {
      "en-US": "Engels (VS) - English (US)",
      "nl-NL": "Nederlands",
    },
    themes: {
      DARK: "Donker",
      LIGHT: "Licht",
      AUTO: "Auto",
    },
    countries: {
      AD: "Andorra",
      AE: "Verenigde Arabische Emiraten",
      AF: "Afghanistan",
      AG: "Antigua en Barbuda",
      AI: "Anguilla",
      AL: "Albanië",
      AM: "Armenië",
      AO: "Angola",
      AQ: "Antarctica",
      AR: "Argentinië",
      AS: "Amerikaans Samoa",
      AT: "Oostenrijk",
      AU: "Australië",
      AW: "Aruba",
      AX: "Ålandeilanden",
      AZ: "Azerbeidzjan",
      BA: "Bosnië en Herzegovina",
      BB: "Barbados",
      BD: "Bangladesh",
      BE: "België",
      BF: "Burkina Faso",
      BG: "Bulgarije",
      BH: "Bahrein",
      BI: "Burundi",
      BJ: "Benin",
      BL: "Saint-Barthélemy",
      BM: "Bermuda",
      BN: "Brunei",
      BO: "Bolivia",
      BQ: "BES-eilanden",
      BR: "Brazilië",
      BS: "Bahama’s",
      BT: "Bhutan",
      BV: "Bouveteiland",
      BW: "Botswana",
      BY: "Belarus",
      BZ: "Belize",
      CA: "Canada",
      CC: "Cocoseilanden",
      CD: "Congo (DRC)",
      CF: "Centraal-Afrikaanse Republiek",
      CG: "Congo (Republiek)",
      CH: "Zwitserland",
      CI: "Ivoorkust",
      CK: "Cookeilanden",
      CL: "Chili",
      CM: "Kameroen",
      CN: "China",
      CO: "Colombia",
      CR: "Costa Rica",
      CU: "Cuba",
      CV: "Kaapverdië",
      CW: "Curaçao",
      CX: "Christmaseiland",
      CY: "Cyprus",
      CZ: "Tsjechië",
      DE: "Duitsland",
      DJ: "Djibouti",
      DK: "Denemarken",
      DM: "Dominica",
      DO: "Dominicaanse Republiek",
      DZ: "Algerije",
      EC: "Ecuador",
      EE: "Estland",
      EG: "Egypte",
      EH: "Westelijke Sahara",
      ER: "Eritrea",
      ES: "Spanje",
      ET: "Ethiopië",
      FI: "Finland",
      FJ: "Fiji",
      FK: "Falklandeilanden",
      FM: "Micronesia",
      FO: "Faeröer",
      FR: "Frankrijk",
      GA: "Gabon",
      GB: "Verenigd Koninkrijk",
      GD: "Grenada",
      GE: "Georgië",
      GF: "Frans-Guyana",
      GG: "Guernsey",
      GH: "Ghana",
      GI: "Gibraltar",
      GL: "Groenland",
      GM: "Gambia",
      GN: "Guinee",
      GP: "Guadeloupe",
      GQ: "Equatoriaal-Guinea",
      GR: "Griekenland",
      GS: "Zuid-Georgia en Zuidelijke Sandwicheilanden",
      GT: "Guatemala",
      GU: "Guam",
      GW: "Guinee-Bissau",
      GY: "Guyana",
      HK: "Hongkong",
      HM: "Heard en McDonaldeilanden",
      HN: "Honduras",
      HR: "Kroatië",
      HT: "Haïti",
      HU: "Hongarije",
      ID: "Indonesië",
      IE: "Ierland",
      IL: "Israël",
      IM: "Isle of Man",
      IN: "India",
      IO: "Britse Gebieden in de Indische Oceaan",
      IQ: "Irak",
      IR: "Iran",
      IS: "IJsland",
      IT: "Italië",
      JE: "Jersey",
      JM: "Jamaica",
      JO: "Jordanië",
      JP: "Japan",
      KE: "Kenia",
      KG: "Kirgizië",
      KH: "Cambodja",
      KI: "Kiribati",
      KM: "Comoren",
      KN: "Saint Kitts en Nevis",
      KP: "Noord-Korea",
      KR: "Zuid-Korea",
      KW: "Koeweit",
      KY: "Caymaneilanden",
      KZ: "Kazachstan",
      LA: "Laos",
      LB: "Libanon",
      LC: "Saint Lucia",
      LI: "Liechtenstein",
      LK: "Sri Lanka",
      LR: "Liberia",
      LS: "Lesotho",
      LT: "Litouwen",
      LU: "Luxemburg",
      LV: "Letland",
      LY: "Libië",
      MA: "Marokko",
      MC: "Monaco",
      MD: "Moldavië",
      ME: "Montenegro",
      MF: "Saint-Martin",
      MG: "Madagaskar",
      MH: "Marshalleilanden",
      MK: "Noord-Macedonië",
      ML: "Mali",
      MM: "Myanmar (Birma)",
      MN: "Mongolië",
      MO: "Macau",
      MP: "Noordelijke Marianen",
      MQ: "Martinique",
      MR: "Mauritanië",
      MS: "Montserrat",
      MT: "Malta",
      MU: "Mauritius",
      MV: "Maldiven",
      MW: "Malawi",
      MX: "Mexico",
      MY: "Maleisië",
      MZ: "Mozambique",
      NA: "Namibië",
      NC: "Nieuw-Caledonië",
      NE: "Niger",
      NF: "Norfolk",
      NG: "Nigeria",
      NI: "Nicaragua",
      NL: "Nederland",
      NO: "Noorwegen",
      NP: "Nepal",
      NR: "Nauru",
      NU: "Niue",
      NZ: "Nieuw-Zeeland",
      OM: "Oman",
      PA: "Panama",
      PE: "Peru",
      PF: "Frans-Polynesië",
      PG: "Papoea-Nieuw-Guinea",
      PH: "Filipijnen",
      PK: "Pakistan",
      PL: "Polen",
      PM: "Saint-Pierre en Miquelon",
      PN: "Pitcairneilanden",
      PR: "Puerto Rico",
      PS: "Palestina",
      PT: "Portugal",
      PW: "Palau",
      PY: "Paraguay",
      QA: "Qatar",
      RE: "Réunion",
      RO: "Roemenië",
      RS: "Servië",
      RU: "Rusland",
      RW: "Rwanda",
      SA: "Saoedi-Arabië",
      SB: "Salomonseilanden",
      SC: "Seychellen",
      SD: "Soedan",
      SE: "Zweden",
      SG: "Singapore",
      SH: "Sint-Helena",
      SI: "Slovenië",
      SJ: "Spitsbergen en Jan Mayen",
      SK: "Slowakije",
      SL: "Sierra Leone",
      SM: "San Marino",
      SN: "Senegal",
      SO: "Somalië",
      SR: "Suriname",
      SS: "Zuid-Soedan",
      ST: "Sao Tomé en Principe",
      SV: "El Salvador",
      SX: "Sint Maarten",
      SY: "Syrië",
      SZ: "Eswatini",
      TC: "Turks- en Caicoseilanden",
      TD: "Tsjaad",
      TF: "Franse Gebieden in de zuidelijke Indische Oceaan",
      TG: "Togo",
      TH: "Thailand",
      TJ: "Tadzjikistan",
      TK: "Tokelau",
      TL: "Oost-Timor",
      TM: "Turkmenistan",
      TN: "Tunesië",
      TO: "Tonga",
      TR: "Turkije",
      TT: "Trinidad en Tobago",
      TV: "Tuvalu",
      TW: "Taiwan",
      TZ: "Tanzania",
      UA: "Oekraïne",
      UG: "Oeganda",
      UM: "Kleine afgelegen eilanden van de Verenigde Staten",
      US: "Verenigde Staten",
      UY: "Uruguay",
      UZ: "Oezbekistan",
      VA: "Vaticaanstad",
      VC: "Saint Vincent en de Grenadines",
      VE: "Venezuela",
      VG: "Britse Maagdeneilanden",
      VI: "Amerikaanse Maagdeneilanden",
      VN: "Vietnam",
      VU: "Vanuatu",
      WF: "Wallis en Futuna",
      WS: "Samoa",
      XK: "Kosovo",
      YE: "Jemen",
      YT: "Mayotte",
      ZA: "Zuid-Afrika",
      ZM: "Zambia",
      ZW: "Zimbabwe",
    },
  },
} satisfies Translation;
