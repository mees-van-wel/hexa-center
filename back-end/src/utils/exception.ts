import type { Exception } from "@front-end/constants/exceptions";
import { TRPCError } from "@trpc/server";

const PG_EXCEPTION_MAP: Record<string, Exception> = {
  "23503": "DB_KEY_CONSTRAINT",
  "23505": "DB_UNIQUE_CONSTRAINT",
} as const;

export const createPgException = (error: any) => {
  if (!("name" in error) || error.name !== "PostgresError")
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `This error is not a PostgresError: ${JSON.stringify(error)}`,
    });

  const exception = PG_EXCEPTION_MAP[error.code] as Exception | undefined;

  console.log(error);

  if (exception === "DB_UNIQUE_CONSTRAINT")
    return new TRPCError({
      code: "BAD_REQUEST",
      message: JSON.stringify({
        exception,
        data: { column: error.constraint_name.split("_")[1] },
      }),
    });

  if (exception === "DB_KEY_CONSTRAINT")
    return new TRPCError({
      code: "BAD_REQUEST",
      message: JSON.stringify({
        exception,
        // TODO retrieve depend name from error
        data: { depend: "Properties" },
      }),
    });

  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Pg error code ${exception} not found in exception map`,
  });
};
