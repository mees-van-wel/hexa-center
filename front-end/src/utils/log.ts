import { isProduction } from "./environment";

export const consoleLog = (message?: any, ...optionalParams: any[]) => {
  if (isProduction) return;
  console.log(message, ...optionalParams);
};
