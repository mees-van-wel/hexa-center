export const ROUTES = {
  HOME: "/",
  LOGIN: "/login/",
  PROFILE: "/profile/",
  PREFERENCES: "/preferences/",
  PROPERTIES: "/properties/",
  PROPERTY: "/properties/[id]/",
  ROLES: "/roles/",
  USERS: "/users/",
  APPOINTMENT_TYPES: "/appointment-types/",
  CALENDAR: "/calendar/",
  PROGRAMS: "/programs/",
  DOSSIERS: "/dossiers/",
  RESERVATIONS: "/reservations/",
  ROOMS: "/rooms/",
} as const;

export type Routes = typeof ROUTES;
export type RouteKeys = keyof Routes;
export type Route = Routes[RouteKeys];

export const ROUTE_KEYS = Object.keys(ROUTES) as RouteKeys[];
export const ROUTE_VALUES = Object.values(ROUTES) as Route[];
