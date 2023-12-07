export type Translation = {
  generic: {
    create: string;
    saving: string;
    saved: string;
  };
  authLayout: {
    help: string;
    version: string;
  };
  dashboardLayout: {
    titles: {
      essentials: string;
      bookings: string;
    }
    avatar: {
      profile: string;
      preferences: string;
      logout: string;
    }
    home: string;
    properties: string;
    roles: string;
    users: string;
    reservations: string;
    rooms: string;
  }
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
