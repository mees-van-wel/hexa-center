import fs from "fs";
import mjml2html from "mjml";
import path from "path";
import { ServerClient } from "postmark";
import { fileURLToPath } from "url";

import { isProduction } from "./environment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = isProduction
  ? path.join(__dirname, "emails")
  : path.join(__dirname, "..", "emails");

const serverToken = process.env.POSTMARK_SERVER_TOKEN;
if (!serverToken)
  throw new Error("Missing POSTMARK_SERVER_TOKEN in .env.local");

const postmarkClient = new ServerClient(serverToken);

type Mails = {
  otp: {
    message: string;
    otp: string;
    validity: string;
  };
};

const replaceTemplateVariables = (
  template: string,
  variables: Record<string, string | undefined>,
) =>
  Object.keys(variables)
    .filter((key) => variables[key])
    .reduce(
      (acc, key) => acc.replace(new RegExp(`{{${key}}}`, "g"), variables[key]!),
      template,
    );

type SendMailProps<T extends keyof Mails> = {
  title: string;
  logo?: string;
  company?: string;
  footer?: string;
  from?: {
    name?: string;
    emailAddress?: string;
  };
  to: {
    name: string;
    emailAddress: string;
  };
  template: T;
  variables: Mails[T];
};

export const sendMail = <T extends keyof Mails>({
  title,
  logo = "https://cdn.mcauto-images-production.sendgrid.net/b2afceaeb16d6ede/8d7c73d8-b2dc-4ec3-b181-b719345cabd4/140x163.png",
  company = "Hexa Center",
  footer,
  from = {
    name: company,
    emailAddress: "noreply@hexa.center",
  },
  to,
  template,
  variables,
}: SendMailProps<T>) => {
  variables = { ...variables, title, logo, company };

  const templatePath = path.join(basePath, `${template}.mjml`);
  const templateContent = replaceTemplateVariables(
    fs.readFileSync(templatePath, "utf8"),
    variables,
  );

  const baseTemplatePath = path.join(basePath, `_base.mjml`);
  let baseTemplateContent = replaceTemplateVariables(
    fs.readFileSync(baseTemplatePath, "utf8"),
    {
      ...variables,
      children: templateContent,
      footer: footer
        ? replaceTemplateVariables(
            fs.readFileSync(path.join(basePath, `_footer.mjml`), "utf8"),
            { children: footer },
          )
        : undefined,
    },
  );

  const { html } = mjml2html(baseTemplateContent.replace(/{{.*?}}/g, ""));

  return postmarkClient.sendEmail({
    From: `${from.name} <${from.emailAddress}>`,
    To: `${to.name} <${to.emailAddress}>`,
    Subject: title,
    HtmlBody: html,
  });
};
