import { eq } from "drizzle-orm";
import soapRequest from "easy-soap-request";
import { picklist, string } from "valibot";

import db from "@/db/client";
import { integrationConnections } from "@/db/schema";
import {
  connectTwinfield,
  getTwinfieldAccessToken,
  getTwinfieldWsdlUrl,
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
        .select({ type: integrationConnections.type })
        .from(integrationConnections)
        .where(eq(integrationConnections.type, type));
      const integration = result[0];
      return integration as typeof integration | undefined;
    }),
  connectTwinfield: procedure
    .input(wrap(string()))
    .mutation(async ({ input: code, ctx }) => {
      await connectTwinfield(code, ctx.relation.id);
    }),
  test: procedure.mutation(async () => {
    const accessToken = await getTwinfieldAccessToken();
    const wsdlUrl = await getTwinfieldWsdlUrl(accessToken);

    try {
      const data = await soapRequest({
        url: wsdlUrl,
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: "http://www.twinfield.com/ProcessXmlDocument",
        },
        xml: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:twinfield="http://www.twinfield.com/">
  <soap:Header>
    <twinfield:Header>
      <twinfield:AccessToken>${accessToken}</twinfield:AccessToken>
    </twinfield:Header>
  </soap:Header>
  <soap:Body>
    <twinfield:ProcessXmlDocument>
      <twinfield:xmlRequest>
        <list>
          <type>offices</type>
        </list>
      </twinfield:xmlRequest>
    </twinfield:ProcessXmlDocument>
  </soap:Body>
</soap:Envelope>`,
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }),
});
