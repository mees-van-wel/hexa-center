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
    modules: {
      essentials: "Essentials",
      bookings: "Bookings",
    },
    avatar: {
      profile: "Profile",
      preferences: "Preferences",
      logout: "Logout",
    },
    home: "Home",
    properties: "Properties",
    roles: "Roles",
    users: "Users",
    reservations: "Reservations",
    rooms: "Rooms",
  },
  loginPage: {
    login: "Login",
    email: "Email",
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
  roomsPage: {
    price: "Price",
    noRooms: "Please add a room first",
    confirmDeleteModal: "If you continue this room will be deleted.",
    roomDeleted: "Room successfully deleted",
    roomCreated: "Room successfully created",
  },
  reservationPage: {
    roomId: "Room",
    customerId: "Customer",
    startDate: "Start date",
    endDate: "End date",
    notes: "Notes",
    guestName: "Guest name",
    reservationCreated: "Reservation successfully created",
    confirmDeleteModal: "If you continue this reservation will be deleted.",
    roomDeleted: "Reservation successfully deleted",
    dateError: "Start date must be earlier than the end date.",
    calendar: {
      noRooms: "No bookings found",
    },
  },
} satisfies Translation;
