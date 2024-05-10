import { toCustom } from "valibot";

// TODO support numbers
export const toNull = () =>
  // @ts-ignore Fix this
  toCustom<string>((input) => {
    if (typeof input !== "string") {
      throw new Error(
        `This pipe is only meant for strings, found "${typeof input}" with a value of ${JSON.stringify(
          input,
        )}`,
      );
    }

    return input || null;
  });
