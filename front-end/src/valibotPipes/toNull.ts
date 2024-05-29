import { toCustom, type ToCustomTransformation } from "valibot";

// TODO support numbers
export const toNull = () =>
  toCustom<string | null>((input) => {
    if (input && typeof input !== "string") {
      throw new Error(
        `This pipe is only meant for strings, found "${typeof input}" with a value of ${JSON.stringify(
          input,
        )}`,
      );
    }

    return input || null;
  }) as ToCustomTransformation<string>;
