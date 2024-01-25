import { custom, email, safeParse, string } from "valibot";

export const nullableEmail = (error = "nullable email error") =>
  custom<string>((input) => {
    if (input) return safeParse(string([email()]), input).success;
    return true;
  }, error);
