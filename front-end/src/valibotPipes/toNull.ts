import { toCustom } from "valibot";

export const toNull = () =>
  toCustom<string>((input) => {
    if (typeof input !== "string") {
      throw new Error(
        `This pipe is only meant for strings, found "${typeof input}" with a value of ${JSON.stringify(
          input,
        )}`,
      );
    }

    return input ? input.trim() : null;
  });
