import { eq } from "drizzle-orm";
import { number } from "valibot";

import { businesses } from "@/db/schema";
import { BusinessCreateSchema, BusinessUpdateSchema } from "@/schemas/business";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

export const businessRouter = router({
  create: procedure
    .input(wrap(BusinessCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(businesses)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
        })
        .returning({
          $kind: businesses.$kind,
          id: businesses.id,
          createdAt: businesses.createdAt,
          createdById: businesses.createdById,
          updatedAt: businesses.updatedAt,
          updatedById: businesses.updatedById,
          name: businesses.name,
          email: businesses.email,
          phone: businesses.phone,
          addressLineOne: businesses.addressLineOne,
          addressLineTwo: businesses.addressLineTwo,
          city: businesses.city,
          region: businesses.region,
          postalCode: businesses.postalCode,
          country: businesses.country,
          cocNumber: businesses.cocNumber,
          vatId: businesses.vatId,
          iban: businesses.iban,
          swiftBic: businesses.swiftBic,
        });

      return result[0];
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: businesses.$kind,
        id: businesses.id,
        name: businesses.name,
        email: businesses.email,
        phone: businesses.phone,
      })
      .from(businesses),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        $kind: businesses.$kind,
        id: businesses.id,
        createdAt: businesses.createdAt,
        createdById: businesses.createdById,
        updatedAt: businesses.updatedAt,
        updatedById: businesses.updatedById,
        name: businesses.name,
        email: businesses.email,
        phone: businesses.phone,
        addressLineOne: businesses.addressLineOne,
        addressLineTwo: businesses.addressLineTwo,
        postalCode: businesses.postalCode,
        city: businesses.city,
        region: businesses.region,
        country: businesses.country,
        cocNumber: businesses.cocNumber,
        vatId: businesses.vatId,
        iban: businesses.iban,
        swiftBic: businesses.swiftBic,
      })
      .from(businesses)
      .where(eq(businesses.id, input));

    const business = result[0];

    if (!business) throw new TRPCError({ code: "NOT_FOUND" });

    return business;
  }),
  update: procedure
    .input(wrap(BusinessUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(businesses)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedById: ctx.user.id,
        })
        .where(eq(businesses.id, input.id))
        .returning({
          $kind: businesses.$kind,
          id: businesses.id,
          createdAt: businesses.createdAt,
          createdById: businesses.createdById,
          updatedAt: businesses.updatedAt,
          updatedById: businesses.updatedById,
          name: businesses.name,
          email: businesses.email,
          phone: businesses.phone,
          addressLineOne: businesses.addressLineOne,
          addressLineTwo: businesses.addressLineTwo,
          postalCode: businesses.postalCode,
          city: businesses.city,
          region: businesses.region,
          country: businesses.country,
          cocNumber: businesses.cocNumber,
          vatId: businesses.vatId,
          iban: businesses.iban,
          swiftBic: businesses.swiftBic,
        });

      return result[0];
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db.delete(businesses).where(eq(businesses.id, input)),
    ),
});
