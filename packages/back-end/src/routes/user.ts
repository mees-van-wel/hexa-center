import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { users } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import { UserCreateSchema, UserUpdateSchema } from "@shared/schemas/user";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  create: procedure.input(wrap(UserCreateSchema)).mutation(({ input, ctx }) =>
    db
      .insert(users)
      .values({
        ...input,
        createdById: ctx.user.id,
        updatedById: ctx.user.id,
        propertyId: 1,
        // Customer role
        roleId: 2,
      })
      .returning({
        $kind: users.$kind,
        id: users.id,
        createdAt: users.createdAt,
        createdById: users.createdById,
        updatedAt: users.updatedAt,
        updatedById: users.updatedById,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phoneNumber: users.phoneNumber,
        street: users.street,
        houseNumber: users.houseNumber,
        postalCode: users.postalCode,
        city: users.city,
        region: users.region,
        country: users.country,
        sex: users.sex,
        dateOfBirth: users.dateOfBirth,
      }),
  ),
  list: procedure.query(() =>
    db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(users),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phoneNumber: users.phoneNumber,
      })
      .from(users)
      .where(eq(users.id, input));

    const user = result[0];
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user;
  }),
  update: procedure.input(wrap(UserUpdateSchema)).mutation(({ input, ctx }) =>
    db
      .update(users)
      .set({
        ...input,
        updatedById: ctx.user.id,
      })
      .where(eq(users.id, input.id))
      .returning({
        $kind: users.$kind,
        id: users.id,
        createdAt: users.createdAt,
        createdById: users.createdById,
        updatedAt: users.updatedAt,
        updatedById: users.updatedById,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phoneNumber: users.phoneNumber,
        street: users.street,
        houseNumber: users.houseNumber,
        postalCode: users.postalCode,
        city: users.city,
        region: users.region,
        country: users.country,
        sex: users.sex,
        dateOfBirth: users.dateOfBirth,
      }),
  ),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input }) => db.delete(users).where(eq(users.id, input))),
});
