import { and, eq } from "drizzle-orm";
import { number, object, picklist, string } from "valibot";

import db from "@/db/client";
import { integrationConnections, integrationMappings } from "@/db/schema";
import {
  connectTwinfield,
  TwinfieldIntegrationData,
} from "@/services/integration";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";

export const integrationRouter = router({
  list: procedure.query(() =>
    db
      .select({ type: integrationConnections.type })
      .from(integrationConnections),
  ),
  get: procedure
    .input(wrap(picklist(["twinfield"])))
    .query(async ({ input: type }) => {
      const result = await db
        .select({
          type: integrationConnections.type,
          data: integrationConnections.data,
        })
        .from(integrationConnections)
        .where(eq(integrationConnections.type, type));

      return result[0]
        ? {
            type: result[0].type,
            data: {
              companyCode: (result[0].data as TwinfieldIntegrationData)
                ?.companyCode,
            },
          }
        : undefined;
    }),
  getMapping: procedure
    .input(
      wrap(
        object({
          refType: picklist(["relation", "productTemplate", "productInstance"]),
          refId: number(),
        }),
      ),
    )
    // TODO Convert to query
    .mutation(async ({ input }) => {
      const result = await db
        .select()
        .from(integrationMappings)
        .where(
          and(
            eq(integrationMappings.refType, input.refType),
            eq(integrationMappings.refId, input.refId),
          ),
        );
      const mapping = result[0];
      return mapping as typeof mapping | undefined;
    }),
  connectTwinfield: procedure
    .input(wrap(string()))
    .mutation(async ({ input: code, ctx }) => {
      await connectTwinfield(code, ctx.relation.id);
    }),
  // listTwinfieldOffices: procedure.mutation(async () => {
  //   const { id, accessToken, companyCode } = await getTwinfieldAccessToken();
  //   const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

  //   console.log(companyCode);

  //   let xml = await readFile("soapEnvelope", "listTwinfieldOffices.xml.ejs");
  //   xml = await ejs.render(xml, { accessToken }, { async: true });

  //   try {
  //     const data = await sendSoapRequest({
  //       url: wsdlUrl,
  //       headers: {
  //         "Content-Type": "text/xml; charset=utf-8",
  //         SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
  //       },
  //       xml,
  //     });

  //     const offices =
  //       data.ProcessXmlDocumentResponse.ProcessXmlDocumentResult.offices.office.map(
  //         (office) => ({
  //           name: office["@_name"],
  //           code: office["#text"].toString(),
  //         }),
  //       );

  //     await db.insert(logs).values({
  //       type: "info",
  //       event: "integrationSend",
  //       refType: "integration",
  //       refId: id,
  //     });

  //     return offices;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }),
});
