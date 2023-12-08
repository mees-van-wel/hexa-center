import { Translation } from "@/types/translation";

export default {
  authLayout: {
    help: "Help",
    version: "Versie",
  },
  loginPage: {
    title: "Inloggen",
    email: "E-mailadres",
    sendEmailCode: "Verstuur E-mailcode",
    emailCodeSent:
      "Als het ingevoerde e-mailadres correct is, is er een code verzonden naar",
    emailRequiredError: "E-mailadres is verplicht",
    emailFormatError: "Ongeldig of verkeerd geformatteerd e-mailadres",
    sendAgain: "Opnieuw versturen",
    code: "Code",
    codeInvalidError: "De code is ongeldig",
    phoneNumber: "Telefoonnummer",
    sendPhoneCode: "Ontvang SMS Code",
    phoneCodeSend:
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
} satisfies Translation;
