import { TRPCError } from "@trpc/server";
import { wrap } from "@typeschema/valibot";
import { and, eq, sql } from "drizzle-orm";
import ejs from "ejs";
import { number } from "valibot";

import {
  customers,
  integrationConnections,
  integrationMappings,
  logs,
} from "~/db/schema";
import { CustomerCreateSchema, CustomerUpdateSchema } from "~/schemas/customer";
import {
  getTwinfieldAccessToken,
  getTwinfieldWsdlUrl,
} from "~/services/integration";
import { procedure, router } from "~/trpc";
import { createPgException } from "~/utils/exception";
import { readFile } from "~/utils/fileSystem";
import { sendSoapRequest } from "~/utils/soap";

export const customerRouter = router({
  create: procedure
    .input(wrap(CustomerCreateSchema))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(customers)
        .values({
          ...input,
          createdById: ctx.user.id,
          updatedById: ctx.user.id,
          // TODO Make dynamic
          businessId: 1,
        })
        .returning({
          $kind: customers.$kind,
          id: customers.id,
          createdAt: customers.createdAt,
          createdById: customers.createdById,
          updatedAt: customers.updatedAt,
          updatedById: customers.updatedById,
          businessId: customers.businessId,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
          billingAddressLineOne: customers.billingAddressLineOne,
          billingAddressLineTwo: customers.billingAddressLineTwo,
          billingCity: customers.billingCity,
          billingRegion: customers.billingRegion,
          billingPostalCode: customers.billingPostalCode,
          billingCountry: customers.billingCountry,
          cocNumber: customers.cocNumber,
          vatId: customers.vatId,
          paymentTermId: customers.paymentTermId,
          contactPersonName: customers.contactPersonName,
          contactPersonEmail: customers.contactPersonEmail,
          contactPersonPhone: customers.contactPersonPhone,
        });

      const customer = result[0];

      const integrationResult = await ctx.db
        .select()
        .from(integrationConnections)
        .where(eq(integrationConnections.type, "twinfield"));

      const integration = integrationResult[0];

      if (integration) {
        const { id, accessToken, companyCode } =
          await getTwinfieldAccessToken();

        const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

        let xml = await readFile(
          "soapEnvelope",
          "createTwinfieldCustomer.xml.ejs",
        );

        xml = await ejs.render(
          xml,
          {
            accessToken,
            companyCode,
            name: customer.name,
            contactName: customer.contactPersonName,
            addressLineOne: customer.billingAddressLineOne,
            postalCode: customer.billingPostalCode,
            city: customer.billingCity,
            country: customer.billingCountry,
            phone: customer.phone,
            email: customer.email,
            vatId: customer.vatId,
            cocNumber: customer.cocNumber,
          },
          { async: true },
        );

        try {
          const response = await sendSoapRequest({
            url: wsdlUrl,
            headers: {
              "Content-Type": "text/xml; charset=utf-8",
              SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
            },
            xml,
          });

          await ctx.db.insert(logs).values({
            type: "info",
            event: "integrationSend",
            refType: "integration",
            refId: id,
          });

          const code =
            response.ProcessXmlDocumentResponse.ProcessXmlDocumentResult
              .dimensions.dimension.code;

          await ctx.db.insert(integrationMappings).values({
            connectionId: id,
            refType: "customer",
            refId: customer.id,
            data: sql`${{ code }}::jsonb`,
          });
        } catch (error) {
          console.warn(error);
        }
      }

      return customer;
    }),
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({
        $kind: customers.$kind,
        id: customers.id,
        name: customers.name,
        email: customers.email,
        phone: customers.phone,
        contactPersonName: customers.contactPersonName,
        contactPersonEmail: customers.contactPersonEmail,
        contactPersonPhone: customers.contactPersonPhone,
      })
      .from(customers),
  ),
  get: procedure.input(wrap(number())).query(async ({ input, ctx }) => {
    const result = await ctx.db
      .select({
        $kind: customers.$kind,
        id: customers.id,
        createdAt: customers.createdAt,
        createdById: customers.createdById,
        updatedAt: customers.updatedAt,
        updatedById: customers.updatedById,
        businessId: customers.businessId,
        name: customers.name,
        email: customers.email,
        phone: customers.phone,
        billingAddressLineOne: customers.billingAddressLineOne,
        billingAddressLineTwo: customers.billingAddressLineTwo,
        billingCity: customers.billingCity,
        billingRegion: customers.billingRegion,
        billingPostalCode: customers.billingPostalCode,
        billingCountry: customers.billingCountry,
        cocNumber: customers.cocNumber,
        vatId: customers.vatId,
        paymentTermId: customers.paymentTermId,
        contactPersonName: customers.contactPersonName,
        contactPersonEmail: customers.contactPersonEmail,
        contactPersonPhone: customers.contactPersonPhone,
      })
      .from(customers)
      .where(eq(customers.id, input));

    const customer = result[0];
    if (!customer) throw new TRPCError({ code: "NOT_FOUND" });

    return customer;
  }),
  update: procedure
    .input(wrap(CustomerUpdateSchema))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await ctx.db
          .update(customers)
          .set({
            ...input,
            updatedAt: new Date(),
            updatedById: ctx.user.id,
          })
          .where(eq(customers.id, input.id))
          .returning({
            $kind: customers.$kind,
            id: customers.id,
            createdAt: customers.createdAt,
            createdById: customers.createdById,
            updatedAt: customers.updatedAt,
            updatedById: customers.updatedById,
            businessId: customers.businessId,
            name: customers.name,
            email: customers.email,
            phone: customers.phone,
            billingAddressLineOne: customers.billingAddressLineOne,
            billingAddressLineTwo: customers.billingAddressLineTwo,
            billingCity: customers.billingCity,
            billingRegion: customers.billingRegion,
            billingPostalCode: customers.billingPostalCode,
            billingCountry: customers.billingCountry,
            cocNumber: customers.cocNumber,
            vatId: customers.vatId,
            paymentTermId: customers.paymentTermId,
            contactPersonName: customers.contactPersonName,
            contactPersonEmail: customers.contactPersonEmail,
            contactPersonPhone: customers.contactPersonPhone,
          });

        const customer = result[0];

        const integrationResult = await ctx.db
          .select()
          .from(integrationConnections)
          .where(eq(integrationConnections.type, "twinfield"));

        const integration = integrationResult[0];

        if (integration) {
          const result = await ctx.db
            .select({ data: integrationMappings.data })
            .from(integrationMappings)
            .where(
              and(
                eq(integrationMappings.refType, "customer"),
                eq(integrationMappings.refId, customer.id),
              ),
            );

          const externalCode = (result[0]?.data as any)?.code as
            | string
            | undefined;
          if (!externalCode)
            throw new Error(
              `Missing twinfield customer code mapping for customer: ${input}`,
            );

          const { id, accessToken, companyCode } =
            await getTwinfieldAccessToken();
          const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

          let xml = await readFile(
            "soapEnvelope",
            "updateTwinfieldCustomer.xml.ejs",
          );

          xml = await ejs.render(
            xml,
            {
              accessToken,
              companyCode,
              code: externalCode,
              name: customer.name,
              contactName: customer.contactPersonName,
              addressLineOne: customer.billingAddressLineOne,
              postalCode: customer.billingPostalCode,
              city: customer.billingCity,
              country: customer.billingCountry,
              phone: customer.phone,
              email: customer.email,
              vatId: customer.vatId,
              cocNumber: customer.cocNumber,
            },
            { async: true },
          );

          try {
            await sendSoapRequest({
              url: wsdlUrl,
              headers: {
                "Content-Type": "text/xml; charset=utf-8",
                SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
              },
              xml,
            });

            await ctx.db.insert(logs).values({
              type: "info",
              event: "integrationSend",
              refType: "integration",
              refId: id,
            });
          } catch (error) {
            console.warn(error);
          }
        }

        return customer;
      } catch (error) {
        throw createPgException(error);
      }
    }),
  delete: procedure.input(wrap(number())).mutation(async ({ input, ctx }) => {
    await ctx.db.delete(customers).where(eq(customers.id, input));

    const integrationResult = await ctx.db
      .select()
      .from(integrationConnections)
      .where(eq(integrationConnections.type, "twinfield"));

    const integration = integrationResult[0];

    if (integration) {
      const result = await ctx.db
        .select({ data: integrationMappings.data })
        .from(integrationMappings)
        .where(
          and(
            eq(integrationMappings.refType, "customer"),
            eq(integrationMappings.refId, input),
          ),
        );

      const externalCode = (result[0]?.data as any)?.code as string | undefined;
      if (!externalCode)
        throw new Error(
          `Missing twinfield customer code mapping for customer: ${input}`,
        );

      const { id, accessToken, companyCode } = await getTwinfieldAccessToken();
      const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

      let xml = await readFile(
        "soapEnvelope",
        "deleteTwinfieldCustomer.xml.ejs",
      );

      xml = await ejs.render(
        xml,
        {
          accessToken,
          companyCode,
          code: externalCode,
        },
        { async: true },
      );

      try {
        await sendSoapRequest({
          url: wsdlUrl,
          headers: {
            "Content-Type": "text/xml; charset=utf-8",
            SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
          },
          xml,
        });

        await ctx.db.insert(logs).values({
          type: "info",
          event: "integrationSend",
          refType: "integration",
          refId: id,
        });

        await ctx.db
          .delete(integrationMappings)
          .where(
            and(
              eq(integrationMappings.refType, "customer"),
              eq(integrationMappings.refId, input),
            ),
          );
      } catch (error) {
        console.warn(error);
      }
    }
  }),
});
