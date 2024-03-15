import soapRequest from "easy-soap-request";
import { XMLParser } from "fast-xml-parser";

type sendSoapRequestProps = {
  url: string;
  headers: Record<string, string>;
  xml: string;
};

// TODO typed generic response
export const sendSoapRequest = async ({
  url,
  headers,
  xml,
}: sendSoapRequestProps) => {
  const {
    response: { body },
  } = await soapRequest({ url, headers, xml });

  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
  });

  return parser.parse(body)["soap:Envelope"]["soap:Body"];
};
