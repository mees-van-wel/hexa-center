import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
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
      const result = await db
        .insert(properties)
        .values({
          ...input,
          createdById: ctx.relation.id,
          updatedById: ctx.relation.id,
        })
        .returning({
          $kind: properties.$kind,
          id: properties.id,
          createdAt: properties.createdAt,
          createdById: properties.createdById,
          updatedAt: properties.updatedAt,
          updatedById: properties.updatedById,
          name: properties.name,
          emailAddress: properties.emailAddress,
          phoneNumber: properties.phoneNumber,
          street: properties.street,
          houseNumber: properties.houseNumber,
          postalCode: properties.postalCode,
          city: properties.city,
          region: properties.region,
          country: properties.country,
        });

      return result[0];
    }),
  list: procedure.query(() =>
    db
      .select({
        $kind: properties.$kind,
        id: properties.id,
        name: properties.name,
        emailAddress: properties.emailAddress,
        phoneNumber: properties.phoneNumber,
      })
      .from(properties),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        $kind: properties.$kind,
        id: properties.id,
        createdAt: properties.createdAt,
        createdById: properties.createdById,
        updatedAt: properties.updatedAt,
        updatedById: properties.updatedById,
        name: properties.name,
        emailAddress: properties.emailAddress,
        phoneNumber: properties.phoneNumber,
        street: properties.street,
        houseNumber: properties.houseNumber,
        postalCode: properties.postalCode,
        city: properties.city,
        region: properties.region,
        country: properties.country,
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
      const result = await db
        .update(properties)
        .set({
          ...input,
          updatedAt: new Date(),
          updatedById: ctx.relation.id,
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
          emailAddress: properties.emailAddress,
          phoneNumber: properties.phoneNumber,
          street: properties.street,
          houseNumber: properties.houseNumber,
          postalCode: properties.postalCode,
          city: properties.city,
          region: properties.region,
          country: properties.country,
        });

      return result[0];
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input }) =>
      db.delete(properties).where(eq(properties.id, input)),
    ),
});
