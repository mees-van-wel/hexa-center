import { Translation } from "@/types/translation";

export default {
  authLayout: {
    help: "Help",
    version: "Version",
  },
  loginPage: {
    title: "Login",
    email: "Email",
    sendEmailCode: "Send Email Code",
    emailCodeSent: "If the entered email is correct, a code has been sent to",
    emailRequiredError: "Email is required",
    emailFormatError: "Invalid or badly formatted email",
    sendAgain: "Send Again",
    code: "Code",
    codeInvalidError: "The code is invalid",
    phoneNumber: "Phone number",
    sendPhoneCode: "Receive SMS Code",
    phoneCodeSend:
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
} satisfies Translation;
