import ejs from "ejs";
import puppeteer from "puppeteer";

import { PDFTemplate, PDFTemplateVariables } from "@/constants/pdfTemplates";

import { readFile } from "./fileSystem";

export const generatePdf = async <T extends PDFTemplate>(
  templateName: T,
  variables: PDFTemplateVariables[T],
) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  let htmlContent = await readFile("pdf", `${templateName}.ejs`);
  htmlContent = await ejs.render(htmlContent, variables, { async: true });

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return pdfBuffer;
};
