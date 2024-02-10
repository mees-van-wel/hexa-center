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
  template: T,
  variables: PDFTemplateVariables[T],
) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const templatePath = path.join(basePath, template + ".html");

  const htmlContent = await fs.readFile(templatePath, "utf8");
  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return pdfBuffer;
};
