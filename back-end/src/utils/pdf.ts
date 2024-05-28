import ejs from "ejs";
import puppeteer from "puppeteer";

import { PDFTemplate, PDFTemplateVariables } from "@/constants/pdfTemplates";

import { isProduction } from "./environment";
import { readFile } from "./fileSystem";

export const generatePdf = async <T extends PDFTemplate>(
  templateName: T,
  variables: PDFTemplateVariables[T],
) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: isProduction
        ? "/usr/bin/google-chrome-stable"
        : undefined,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        // "--no-zygote",
        // "--single-process",
      ],
    });

    const page = await browser.newPage();

    let htmlContent = await readFile("pdf", `${templateName}.html.ejs`);
    htmlContent = await ejs.render(htmlContent, variables, { async: true });

    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.warn(error);
    return Buffer.from("");
  }
};
