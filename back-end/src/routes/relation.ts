import { and, eq, sql } from "drizzle-orm";
import ejs from "ejs";
import { number } from "valibot";

import db from "@/db/client";
import {
  integrationConnections,
  integrationMappings,
  logs,
  relations,
} from "@/db/schema";
import {
  getTwinfieldAccessToken,
  getTwinfieldWsdlUrl,
} from "@/services/integration";
import { procedure, router } from "@/trpc";
import { createPgException } from "@/utils/exception";
import { readFile } from "@/utils/fileSystem";
import { sendSoapRequest } from "@/utils/soap";
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
          type: relations.type,
          name: relations.name,
          emailAddress: relations.emailAddress,
          phoneNumber: relations.phoneNumber,
          street: relations.street,
          houseNumber: relations.houseNumber,
          postalCode: relations.postalCode,
          city: relations.city,
          region: relations.region,
          country: relations.country,
          dateOfBirth: relations.dateOfBirth,
          sex: relations.sex,
          vatNumber: relations.vatNumber,
          cocNumber: relations.cocNumber,
          businessContactName: relations.businessContactName,
          businessContactEmailAddress: relations.businessContactEmailAddress,
          businessContactPhoneNumber: relations.businessContactPhoneNumber,
        });

      const relation = result[0];

      const integrationResult = await db
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
            name: relation.name,
            businessContactName: relation.businessContactName,
            street: relation.street,
            houseNumber: relation.houseNumber,
            postalCode: relation.postalCode,
            city: relation.city,
            country: relation.country,
            phoneNumber: relation.phoneNumber,
            emailAddress: relation.emailAddress,
            vatNumber: relation.vatNumber,
            cocNumber: relation.cocNumber,
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

          await db.insert(logs).values({
            type: "info",
            event: "integrationSend",
            refType: "integration",
            refId: id,
          });

          const externalId =
            response.ProcessXmlDocumentResponse.ProcessXmlDocumentResult
              .dimensions.dimension.code;

          await db.insert(integrationMappings).values({
            connectionId: id,
            refType: "relation",
            refId: relation.id,
            data: sql`${{ externalId }}::jsonb`,
          });
        } catch (error) {
          console.log(error);
        }
      }

      return relation;
    }),
  list: procedure.query(() =>
    db
      .select({
        $kind: relations.$kind,
        id: relations.id,
        type: relations.type,
        name: relations.name,
        emailAddress: relations.emailAddress,
        phoneNumber: relations.phoneNumber,
        businessContactName: relations.businessContactName,
      })
      .from(relations),
  ),
  get: procedure.input(wrap(number())).query(async ({ input }) => {
    const result = await db
      .select({
        $kind: relations.$kind,
        id: relations.id,
        createdAt: relations.createdAt,
        createdById: relations.createdById,
        updatedAt: relations.updatedAt,
        updatedById: relations.updatedById,
        type: relations.type,
        name: relations.name,
        emailAddress: relations.emailAddress,
        phoneNumber: relations.phoneNumber,
        street: relations.street,
        houseNumber: relations.houseNumber,
        postalCode: relations.postalCode,
        city: relations.city,
        region: relations.region,
        country: relations.country,
        dateOfBirth: relations.dateOfBirth,
        sex: relations.sex,
        vatNumber: relations.vatNumber,
        cocNumber: relations.cocNumber,
        businessContactName: relations.businessContactName,
        businessContactEmailAddress: relations.businessContactEmailAddress,
        businessContactPhoneNumber: relations.businessContactPhoneNumber,
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
            updatedAt: new Date(),
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
            type: relations.type,
            name: relations.name,
            emailAddress: relations.emailAddress,
            phoneNumber: relations.phoneNumber,
            street: relations.street,
            houseNumber: relations.houseNumber,
            postalCode: relations.postalCode,
            city: relations.city,
            region: relations.region,
            country: relations.country,
            dateOfBirth: relations.dateOfBirth,
            sex: relations.sex,
            vatNumber: relations.vatNumber,
            cocNumber: relations.cocNumber,
            businessContactName: relations.businessContactName,
            businessContactEmailAddress: relations.businessContactEmailAddress,
            businessContactPhoneNumber: relations.businessContactPhoneNumber,
          });

        const relation = result[0];

        const integrationResult = await db
          .select()
          .from(integrationConnections)
          .where(eq(integrationConnections.type, "twinfield"));

        const integration = integrationResult[0];

        if (integration) {
          const result = await db
            .select({ data: integrationMappings.data })
            .from(integrationMappings)
            .where(
              and(
                eq(integrationMappings.refType, "relation"),
                eq(integrationMappings.refId, relation.id),
              ),
            );

          const externalId = result[0]?.data?.externalId as string | undefined;
          if (!externalId)
            throw new Error(
              `Missing twinfield customer code mapping for relation: ${input}`,
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
              code: externalId,
              name: relation.name,
              businessContactName: relation.businessContactName,
              street: relation.street,
              houseNumber: relation.houseNumber,
              postalCode: relation.postalCode,
              city: relation.city,
              country: relation.country,
              phoneNumber: relation.phoneNumber,
              emailAddress: relation.emailAddress,
              vatNumber: relation.vatNumber,
              cocNumber: relation.cocNumber,
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

            await db.insert(logs).values({
              type: "info",
              event: "integrationSend",
              refType: "integration",
              refId: id,
            });
          } catch (error) {
            console.log(error);
          }
        }

        return relation;
      } catch (error) {
        throw createPgException(error);
      }
    }),
  delete: procedure.input(wrap(number())).mutation(async ({ input }) => {
    await db.delete(relations).where(eq(relations.id, input));

    const integrationResult = await db
      .select()
      .from(integrationConnections)
      .where(eq(integrationConnections.type, "twinfield"));

    const integration = integrationResult[0];

    if (integration) {
      const result = await db
        .select({ data: integrationMappings.data })
        .from(integrationMappings)
        .where(
          and(
            eq(integrationMappings.refType, "relation"),
            eq(integrationMappings.refId, input),
          ),
        );

      const externalId = result[0]?.data?.externalId as string | undefined;
      if (!externalId)
        throw new Error(
          `Missing twinfield customer code mapping for relation: ${input}`,
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
          code: externalId,
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

        await db.insert(logs).values({
          type: "info",
          event: "integrationSend",
          refType: "integration",
          refId: id,
        });

        await db
          .delete(integrationMappings)
          .where(
            and(
              eq(integrationMappings.refType, "relation"),
              eq(integrationMappings.refId, input),
            ),
          );
      } catch (error) {
        console.log(error);
      }
    }
  }),
});
