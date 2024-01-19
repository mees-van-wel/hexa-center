import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { relations } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { createPgException } from "@/utils/exception";
import { wrap } from "@decs/typeschema";
import {
  RelationCreateSchema,
  RelationUpdateSchema,
} from "@front-end/schemas/relation";
import { TRPCError } from "@trpc/server";

export const relationRouter = router({
  create: procedure
    .input(wrap(RelationCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .insert(relations)
        .values({
          ...input,
          createdById: ctx.relation.id,
          updatedById: ctx.relation.id,
          propertyId: 1,
          // Customer role
          roleId: 2,
        })
        .returning({
          $kind: relations.$kind,
          id: relations.id,
          createdAt: relations.createdAt,
          createdById: relations.createdById,
          updatedAt: relations.updatedAt,
          updatedById: relations.updatedById,
          name: relations.name,
          emailAddress: relations.emailAddress,
          phoneNumber: relations.phoneNumber,
          street: relations.street,
          houseNumber: relations.houseNumber,
          postalCode: relations.postalCode,
          city: relations.city,
          region: relations.region,
          country: relations.country,
          sex: relations.sex,
          dateOfBirth: relations.dateOfBirth,
        });

      return result[0];
    }),
  list: procedure.query(() =>
    db
      .select({
        $kind: relations.$kind,
        id: relations.id,
        name: relations.name,
        emailAddress: relations.emailAddress,
        phoneNumber: relations.phoneNumber,
      })
      .from(relations),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        $kind: relations.$kind,
        id: relations.id,
        name: relations.name,
        emailAddress: relations.emailAddress,
        phoneNumber: relations.phoneNumber,
        street: relations.street,
        houseNumber: relations.houseNumber,
        postalCode: relations.postalCode,
        city: relations.city,
        region: relations.region,
        country: relations.country,
        sex: relations.sex,
        dateOfBirth: relations.dateOfBirth,
      })
      .from(relations)
      .where(eq(relations.id, input));

    const relation = result[0];
    if (!relation) throw new TRPCError({ code: "NOT_FOUND" });

    return relation;
  }),
  update: procedure
    .input(wrap(RelationUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await db
          .update(relations)
          .set({
            ...input,
            updatedById: ctx.relation.id,
          })
          .where(eq(relations.id, input.id))
          .returning({
            $kind: relations.$kind,
            id: relations.id,
            createdAt: relations.createdAt,
            createdById: relations.createdById,
            updatedAt: relations.updatedAt,
            updatedById: relations.updatedById,
            name: relations.name,
            emailAddress: relations.emailAddress,
            phoneNumber: relations.phoneNumber,
            street: relations.street,
            houseNumber: relations.houseNumber,
            postalCode: relations.postalCode,
            city: relations.city,
            region: relations.region,
            country: relations.country,
            sex: relations.sex,
            dateOfBirth: relations.dateOfBirth,
          });

        return result[0];
      } catch (error) {
        throw createPgException(error);
      }
    }),
  delete: procedure
    .input(wrap(number()))
    .mutation(({ input }) =>
      db.delete(relations).where(eq(relations.id, input)),
    ),
});
