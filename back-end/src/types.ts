export declare class Stringified<T> extends String {
  private ___stringified: T;
}

export type P<T> = {
  [K in keyof T]: T[K];
} & {};
