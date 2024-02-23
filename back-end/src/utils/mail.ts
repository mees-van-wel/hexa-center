import fs from "fs/promises";
import mjml2html from "mjml";
import path from "path";
import { Attachment, ServerClient } from "postmark";
import { fileURLToPath } from "url";

import { isProduction } from "./environment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = isProduction
  ? path.join(__dirname, "emails")
  : path.join(__dirname, "..", "src", "emails");

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
  invoice: {
    message: string;
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
  attachments?: Attachment[];
};

export const sendMail = async <T extends keyof Mails>({
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
  attachments,
}: SendMailProps<T>) => {
  variables = { ...variables, title, logo, company };

  const templatePath = path.join(basePath, `${template}.mjml`);
  const baseTemplatePath = path.join(basePath, `_base.mjml`);

  const readPromises = [
    fs.readFile(templatePath, "utf8"),
    fs.readFile(baseTemplatePath, "utf8"),
  ];

  if (footer) {
    const footerPath = path.join(basePath, `_footer.mjml`);
    readPromises.push(fs.readFile(footerPath, "utf8"));
  }

  let [templateContent, baseTemplateContent, footerContent] =
    await Promise.all(readPromises);

  templateContent = replaceTemplateVariables(templateContent, variables);
  baseTemplateContent = replaceTemplateVariables(baseTemplateContent, {
    ...variables,
    children: templateContent,
    footer: footerContent,
  });

  const { html } = mjml2html(baseTemplateContent.replace(/{{.*?}}/g, ""));

  return await postmarkClient.sendEmail({
    From: `${from.name} <${from.emailAddress}>`,
    To: `${to.name} <${to.emailAddress}>`,
    Subject: title,
    HtmlBody: html,
    Attachments: attachments,
  });
};
