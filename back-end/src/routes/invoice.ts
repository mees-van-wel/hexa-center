import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { invoices } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";
import { TRPCError } from "@trpc/server";

export const invoiceRouter = router({
  // create: procedure
  //   .input(wrap(UserCreateSchema))
  //   .mutation(async ({ input, ctx }) => {
  //     const result = await db
  //       .insert(users)
  //       .values({
  //         ...input,
  //         createdById: ctx.user.id,
  //         updatedById: ctx.user.id,
  //         propertyId: 1,
  //         // Customer role
  //         roleId: 2,
  //       })
  //       .returning({
  //         $kind: users.$kind,
  //         id: users.id,
  //         createdAt: users.createdAt,
  //         createdById: users.createdById,
  //         updatedAt: users.updatedAt,
  //         updatedById: users.updatedById,
  //         firstName: users.firstName,
  //         lastName: users.lastName,
  //         email: users.email,
  //         phoneNumber: users.phoneNumber,
  //         street: users.street,
  //         houseNumber: users.houseNumber,
  //         postalCode: users.postalCode,
  //         city: users.city,
  //         region: users.region,
  //         country: users.country,
  //         sex: users.sex,
  //         dateOfBirth: users.dateOfBirth,
  //       });

  //     return result[0];
  //   }),
  list: procedure.query(() =>
    db
      .select({
        $kind: invoices.$kind,
        id: invoices.id,
        type: invoices.type,
        number: invoices.number,
        customerName: invoices.customerName,
        issueDate: invoices.issueDate,
        totalGrossAmount: invoices.totalGrossAmount,
        status: invoices.status,
      })
      .from(invoices),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        $kind: invoices.$kind,
        id: invoices.id,
        refType: invoices.refType,
        refId: invoices.refId,
        type: invoices.type,
        number: invoices.number,
        issueDate: invoices.issueDate,
        totalGrossAmount: invoices.totalGrossAmount,
        status: invoices.status,
        comments: invoices.comments,

        customerId: invoices.customerId,
        customerName: invoices.customerName,
        customerStreet: invoices.customerStreet,
        customerHouseNumber: invoices.customerHouseNumber,
        customerPostalCode: invoices.customerPostalCode,
        customerCity: invoices.customerCity,
        customerRegion: invoices.customerRegion,
        customerCountry: invoices.customerCountry,
        customerEmailAddress: invoices.customerEmailAddress,
        customerPhoneNumber: invoices.customerPhoneNumber,
        customerVatNumber: invoices.customerVatNumber,
        customerCocNumber: invoices.customerCocNumber,

        companyId: invoices.companyId,
        companyName: invoices.companyName,
        companyStreet: invoices.companyStreet,
        companyHouseNumber: invoices.companyHouseNumber,
        companyPostalCode: invoices.companyPostalCode,
        companyCity: invoices.companyCity,
        companyRegion: invoices.companyRegion,
        companyCountry: invoices.companyCountry,
        companyEmailAddress: invoices.companyEmailAddress,
        companyPhoneNumber: invoices.companyPhoneNumber,
        companyVatNumber: invoices.companyVatNumber,
        companyCocNumber: invoices.companyCocNumber,
        companyIban: invoices.companyIban,
        companySwiftBic: invoices.companySwiftBic,
      })
      .from(invoices)
      .where(eq(invoices.id, input));

    const invoice = result[0];
    if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });

    return invoice;
  }),
  // update: procedure
  //   .input(wrap(UserUpdateSchema))
  //   .mutation(async ({ input, ctx }) => {
  //     try {
  //       const result = await db
  //         .update(users)
  //         .set({
  //           ...input,
  //           updatedById: ctx.user.id,
  //         })
  //         .where(eq(users.id, input.id))
  //         .returning({
  //           $kind: users.$kind,
  //           id: users.id,
  //           createdAt: users.createdAt,
  //           createdById: users.createdById,
  //           updatedAt: users.updatedAt,
  //           updatedById: users.updatedById,
  //           firstName: users.firstName,
  //           lastName: users.lastName,
  //           email: users.email,
  //           phoneNumber: users.phoneNumber,
  //           street: users.street,
  //           houseNumber: users.houseNumber,
  //           postalCode: users.postalCode,
  //           city: users.city,
  //           region: users.region,
  //           country: users.country,
  //           sex: users.sex,
  //           dateOfBirth: users.dateOfBirth,
  //         });

  //       return result[0];
  //     } catch (error) {
  //       throw createPgException(error);
  //     }
  //   }),
  // delete: procedure
  //   .input(wrap(number()))
  //   .mutation(({ input }) => db.delete(users).where(eq(users.id, input))),
});
