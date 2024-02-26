import { getAllTimezones } from "countries-and-timezones";
export const TIMEZONES = Object.keys(getAllTimezones()) as (keyof ReturnType<
  typeof getAllTimezones
>)[];
export type Timezones = typeof TIMEZONES;
export type Timezone = Timezones[number];
export const DEFAULT_TIMEZONE = "CET";
