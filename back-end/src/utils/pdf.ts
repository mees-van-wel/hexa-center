import ejs from "ejs";
import puppeteer from "puppeteer";

import { PDFTemplate, PDFTemplateVariables } from "@/constants/pdfTemplates";

import { isProduction } from "./environment";
import { readFile } from "./fileSystem";

export const generatePdf = async <T extends PDFTemplate>(
  templateName: T,
  variables: PDFTemplateVariables[T],
) => {
  const browser = await puppeteer.launch({
    executablePath: isProduction ? "/usr/bin/chromium-browser" : undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--headless",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  const page = await browser.newPage();

  let htmlContent = await readFile("pdf", `${templateName}.html.ejs`);
  htmlContent = await ejs.render(htmlContent, variables, { async: true });

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return pdfBuffer;
};
