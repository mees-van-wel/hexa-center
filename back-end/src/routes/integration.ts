import { eq } from "drizzle-orm";
import { picklist, string } from "valibot";

import { integrationConnections } from "@/db/schema";
import {
  connectTwinfield,
  TwinfieldIntegrationData,
} from "@/services/integration";
import { procedure, router } from "@/trpc";
import { wrap } from "@decs/typeschema";

export const integrationRouter = router({
  list: procedure.query(({ ctx }) =>
    ctx.db
      .select({ type: integrationConnections.type })
      .from(integrationConnections),
  ),
  get: procedure
    .input(wrap(picklist(["twinfield"])))
    .query(async ({ input: type, ctx }) => {
      const result = await ctx.db
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
  connectTwinfield: procedure
    .input(wrap(string()))
    .mutation(async ({ input: code, ctx }) => {
      await connectTwinfield(code, ctx.user.id);
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
