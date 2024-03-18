import { eq } from "drizzle-orm";
import { number } from "valibot";

import { users } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { createPgException } from "@/utils/exception";
import { wrap } from "@decs/typeschema";
import { UserCreateSchema, UserUpdateSchema } from "@front-end/schemas/user";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  create: procedure
    .input(wrap(UserCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(users)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
          propertyId: 1,
          roleId: 1,
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
          phone: users.phone,
          addressLineOne: users.addressLineOne,
          addressLineTwo: users.addressLineTwo,
          city: users.city,
          region: users.region,
          postalCode: users.postalCode,
          country: users.country,
          sex: users.sex,
          birthDate: users.birthDate,
        });

      const user = result[0];

      return user;
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: users.$kind,
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(users),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        $kind: users.$kind,
        id: users.id,
        createdAt: users.createdAt,
        createdById: users.createdById,
        updatedAt: users.updatedAt,
        updatedById: users.updatedById,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        addressLineOne: users.addressLineOne,
        addressLineTwo: users.addressLineTwo,
        city: users.city,
        region: users.region,
        postalCode: users.postalCode,
        country: users.country,
        sex: users.sex,
        birthDate: users.birthDate,
      })
      .from(users)
      .where(eq(users.id, input));

    const user = result[0];
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return user;
  }),
  update: procedure
    .input(wrap(UserUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.db
          .update(users)
          .set({
            ...input,
            updatedAt: new Date(),
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
            phone: users.phone,
            addressLineOne: users.addressLineOne,
            addressLineTwo: users.addressLineTwo,
            city: users.city,
            region: users.region,
            postalCode: users.postalCode,
            country: users.country,
            sex: users.sex,
            birthDate: users.birthDate,
          });

        const user = result[0];

        return user;
      } catch (error) {
        throw createPgException(error);
      }
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db.delete(users).where(eq(users.id, input)),
    ),
});
