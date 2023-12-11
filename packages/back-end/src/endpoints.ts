import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Endpoint } from "./types.js";
import { validator } from "./utils/validate.js";

type EndpointToImport = {
  href: string;
  route: string;
};

type Method = "get" | "post" | "put" | "delete" | "patch" | "options";
const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatName = (name: string) => {
  name = name.replace(".js", "").replace(".ts", "");

  if (name === "index") return "";

  if (name.startsWith("[") && name.endsWith("]"))
    return ":" + name.replace("[", "").replace("]", "");

  return name;
};

export const setupEndpoints = async (endpointsDirectory = "api") => {
  const router = Router();
  const endpointsToImport: EndpointToImport[] = [];

  const findEndpoints = (directory: string, parentRoute: string = "") => {
    const contents = fs.readdirSync(directory);

    for (const content of contents) {
      const contentPath = path.join(directory, content);
      const stat = fs.statSync(contentPath);
      if (stat.isDirectory())
        findEndpoints(contentPath, `${parentRoute}/${content}`);
      else if (content.endsWith(".ts") || content.endsWith(".js"))
        endpointsToImport.push({
          href: pathToFileURL(contentPath).href,
          route: `${parentRoute}/${formatName(content)}`,
        });
    }
  };

  findEndpoints(path.join(__dirname, endpointsDirectory));

  await Promise.all(
    endpointsToImport.map(async ({ href, route }) => {
      const routeHandlers = await import(href);
      METHODS.filter((method) => routeHandlers[method]).forEach((method) => {
        router[method.toLowerCase() as Method](route, (req, res, next) => {
          const endpointHandler: Endpoint = routeHandlers[method];
          const validate = validator(req, res);
          endpointHandler({ req, res, next, validate });
        });
      });
    }),
  );

  return router;
};
