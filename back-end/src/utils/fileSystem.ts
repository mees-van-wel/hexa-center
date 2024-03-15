import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { isProduction } from "./environment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Type = {
  mail: "email",
  pdf: "pdf",
  soapEnvelope: "soapEnvelope",
} as const;

const Files = {
  [Type.mail]: ["_base.mjml", "_footer.mjml", "invoice.mjml", "otp.mjml"],
  [Type.pdf]: ["invoice.ejs"],
  [Type.soapEnvelope]: [
    "listTwinfieldOffices.xml.ejs",
    "createTwinfieldCustomer.xml.ejs",
    "updateTwinfieldCustomer.xml.ejs",
    "deleteTwinfieldCustomer.xml.ejs",
    "createTwinfieldTransaction.xml.ejs",
    "spreadTwinfieldTransaction.xml.ejs",
  ],
} as const;

const Path = {
  [Type.mail]: "emails",
  [Type.pdf]: "pdfs",
  [Type.soapEnvelope]: "soapEnvelopes",
};

export const readFile = <T extends (typeof Type)[keyof typeof Type]>(
  type: T,
  file: (typeof Files)[T][number],
) => {
  const filePath = isProduction
    ? path.join(__dirname, Path[type])
    : path.join(__dirname, "..", "src", Path[type]);

  return fs.readFile(path.join(filePath, file), "utf8");
};
