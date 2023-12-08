import { Request, Response, NextFunction } from "express";
import { validator } from "./utils/validate.js";

export type Endpoint = (params: {
  req: Request;
  res: Response;
  next: NextFunction;
  validate: ReturnType<typeof validator>;
}) => void;

export declare class Stringified<T> extends String {
  private ___stringified: T;
}

export type P<T> = {
  [K in keyof T]: T[K];
} & {};
