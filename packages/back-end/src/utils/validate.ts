import type { Request, Response } from "express";
import { type ObjectSchema, parse } from "valibot";

export const validator =
  (req: Request, res: Response) =>
  <T extends ObjectSchema<any>>(schema: T) => {
    try {
      return parse(schema, req.body);
    } catch (error) {
      res.status(400).json(error);
      throw new Error(error as string);
    }
  };
