import mjml2html from "mjml";
import { Attachment, ServerClient } from "postmark";

import { readFile } from "./fileSystem";

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
  };
  replyToEmail?: string;
  to: {
    name: string;
    email: string;
  };
  template: T;
  variables: Mails[T];
  attachments?: Attachment[];
};

export const sendMail = async <T extends keyof Mails>({
  title,
  logo = "https://cdn.mcauto-images-production.sendgrid.net/b2afceaeb16d6ede/8d7c73d8-b2dc-4ec3-b181-b719345cabd4/140x163.png",
  footer,
  from = {
    name: "Hexa Center",
  },
  replyToEmail,
  company = from.name,
  to,
  template,
  variables,
  attachments,
}: SendMailProps<T>) => {
  variables = { ...variables, title, logo, company };

  const readPromises = [
    readFile("email", `${template}.mjml`),
    readFile("email", "_base.mjml"),
  ];

  if (footer) readPromises.push(readFile("email", "_footer.mjml"));

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
    From: `${from.name} <noreply@hexa.center>`,
    ReplyTo: replyToEmail,
    To: `${to.name} <${to.email}>`,
    Subject: title,
    HtmlBody: html,
    Attachments: attachments,
  });
};
