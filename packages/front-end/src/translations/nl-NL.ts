import { Translation } from "@/types/translation";

export default {
  common: {
    back: "Terug",
    create: "Aanmaken",
    save: "Opslaan",
    saving: "Opslaan",
    saved: "Opgeslagen",
    number: "Nummer",
    delete: "Verwijderen",
  },
  authLayout: {
    help: "Help",
    version: "Versie",
  },
  dashboardLayout: {
    modules: {
      essentials: "Essentiële zaken",
      bookings: "Bookingen",
    },
    avatar: {
      profile: "Profile",
      preferences: "Preferences",
      logout: "Logout",
    },
    home: "Home",
    properties: "Vestigingen",
    roles: "Rollen",
    users: "Gebruikers",
    reservations: "Reservaties",
    rooms: "Kamers",
  },
  loginPage: {
    login: "Inloggen",
    email: "E-mailadres",
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
  roomsPage: {
    name: "Kamer naam",
    price: "Prijs per nacht",
  },
} satisfies Translation;
