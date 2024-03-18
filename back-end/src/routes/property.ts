import { eq } from "drizzle-orm";
import { number } from "valibot";

import { properties } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import {
  PropertyCreateSchema,
  PropertyUpdateSchema,
} from "@front-end/schemas/property";
import { TRPCError } from "@trpc/server";

export const propertyRouter = router({
  create: procedure
    .input(wrap(PropertyCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(properties)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
        })
        .returning({
          $kind: properties.$kind,
          id: properties.id,
          createdAt: properties.createdAt,
          createdById: properties.createdById,
          updatedAt: properties.updatedAt,
          updatedById: properties.updatedById,
          name: properties.name,
          email: properties.email,
          phone: properties.phone,
          addressLineOne: properties.addressLineOne,
          addressLineTwo: properties.addressLineTwo,
          city: properties.city,
          region: properties.region,
          postalCode: properties.postalCode,
          country: properties.country,
          cocNumber: properties.cocNumber,
          vatId: properties.vatId,
          iban: properties.iban,
          swiftBic: properties.swiftBic,
        });

      return result[0];
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: properties.$kind,
        id: properties.id,
        name: properties.name,
        email: properties.email,
        phone: properties.phone,
      })
      .from(properties),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        $kind: properties.$kind,
        id: properties.id,
        createdAt: properties.createdAt,
        createdById: properties.createdById,
        updatedAt: properties.updatedAt,
        updatedById: properties.updatedById,
        name: properties.name,
        email: properties.email,
        phone: properties.phone,
        addressLineOne: properties.addressLineOne,
        addressLineTwo: properties.addressLineTwo,
        postalCode: properties.postalCode,
        city: properties.city,
        region: properties.region,
        country: properties.country,
        cocNumber: properties.cocNumber,
        vatId: properties.vatId,
        iban: properties.iban,
        swiftBic: properties.swiftBic,
      })
      .from(properties)
      .where(eq(properties.id, input));

    const property = result[0];

    if (!property) throw new TRPCError({ code: "NOT_FOUND" });

    return property;
  }),
  update: procedure
    .input(wrap(PropertyUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(properties)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedById: ctx.user.id,
        })
        .where(eq(properties.id, input.id))
        .returning({
          $kind: properties.$kind,
          id: properties.id,
          createdAt: properties.createdAt,
          createdById: properties.createdById,
          updatedAt: properties.updatedAt,
          updatedById: properties.updatedById,
          name: properties.name,
          email: properties.email,
          phone: properties.phone,
          addressLineOne: properties.addressLineOne,
          addressLineTwo: properties.addressLineTwo,
          postalCode: properties.postalCode,
          city: properties.city,
          region: properties.region,
          country: properties.country,
          cocNumber: properties.cocNumber,
          vatId: properties.vatId,
          iban: properties.iban,
          swiftBic: properties.swiftBic,
        });

      return result[0];
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input, ctx }) =>
      ctx.db.delete(properties).where(eq(properties.id, input)),
    ),
});
