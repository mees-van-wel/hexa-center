import { eq } from "drizzle-orm";
import { number } from "valibot";

import db from "@/db/client";
import { invoices } from "@/db/schema";
import { procedure, router } from "@/trpc";
import { generatePdf } from "@/utils/pdf";
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
        status: invoices.status,
        number: invoices.number,
        customerName: invoices.customerName,
        createdAt: invoices.createdAt,
        date: invoices.date,
        totalGrossAmount: invoices.totalGrossAmount,
      })
      .from(invoices),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, input),
      with: {
        lines: {
          columns: {
            id: true,
            name: true,
            comments: true,
            unitNetAmount: true,
            quantity: true,
            discountAmount: true,
            totalNetAmount: true,
            totalTaxAmount: true,
            taxPercentage: true,
            totalGrossAmount: true,
          },
        },
        events: {
          columns: {
            id: true,
            createdAt: true,
            createdById: true,
            type: true,
            refType: true,
            refId: true,
          },
        },
      },
      columns: {
        $kind: true,
        id: true,
        createdAt: true,
        createdById: true,
        refType: true,
        refId: true,
        number: true,
        comments: true,
        type: true,
        status: true,
        discountAmount: true,
        totalNetAmount: true,
        totalTaxAmount: true,
        totalGrossAmount: true,
        totalDiscountAmount: true,

        customerId: true,
        customerName: true,
        customerStreet: true,
        customerHouseNumber: true,
        customerPostalCode: true,
        customerCity: true,
        customerRegion: true,
        customerCountry: true,
        customerEmailAddress: true,
        customerPhoneNumber: true,
        customerVatNumber: true,
        customerCocNumber: true,

        companyId: true,
        companyName: true,
        companyStreet: true,
        companyHouseNumber: true,
        companyPostalCode: true,
        companyCity: true,
        companyRegion: true,
        companyCountry: true,
        companyEmailAddress: true,
        companyPhoneNumber: true,
        companyVatNumber: true,
        companyCocNumber: true,
        companyIban: true,
        companySwiftBic: true,
      },
    });

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
  generatePdf: procedure.input(wrap(number())).mutation(async ({ input }) => {
    const pdfBuffer = await generatePdf("invoice", { name: "Lol" });
    return pdfBuffer.toString("base64");
  }),
  // mail: procedure.input(wrap(number())).mutation(async ({ input }) => {
  //   const pdfBuffer = await generatePdf("invoice");

  //   const settingsResult = await db.select().from(settings);

  //   settingsResult.reduce((key) => {}, {});

  //   await sendMail({
  //     title: "Login email code",
  //     to: {
  //       name: relation.name,
  //       emailAddress: input.emailAddress,
  //     },
  //     template: "otp",
  //     variables: {
  //       message: `Here is your code to login.`,
  //       otp,
  //       validity:
  //         "This code is valid for 10 minutes. Do not share this code with anyone.",
  //     },
  //     footer:
  //       "If you did not request this, please ignore this email or contact our support department.",
  //   });
  // }),
});
