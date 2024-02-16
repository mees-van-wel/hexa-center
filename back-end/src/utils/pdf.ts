import ejs from "ejs";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

import { PDFTemplate, PDFTemplateVariables } from "@/constants/pdfTemplates";

import { isProduction } from "./environment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = isProduction
  ? path.join(__dirname, "pdfs")
  : path.join(__dirname, "..", "src", "pdfs");

export const generatePdf = async <T extends PDFTemplate>(
  templateName: T,
  variables: PDFTemplateVariables[T],
) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const templatePath = path.join(basePath, `${templateName}.ejs`);

  let htmlContent = await fs.readFile(templatePath, "utf8");
  htmlContent = await ejs.render(htmlContent, variables, { async: true });

  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  return pdfBuffer;
};
