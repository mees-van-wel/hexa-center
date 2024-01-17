import { pack, unpack } from "msgpackr";
import { parse, stringify } from "superjson";

import { isProduction } from "./environment";

export const trpcTransformer = {
  serialize: (data: any) => {
    if (!data) return data;
    if (!isProduction) return stringify(data);

    try {
      return pack(data).toString("base64");
    } catch (error) {
      console.log(error);
    }

    return data;
  },
  deserialize: (data: string) => {
    if (!data) return data;
    if (!isProduction) return parse(data);

    try {
      // @ts-ignore
      if (typeof window === "undefined") {
        const buffer = Buffer.from(data, "base64");
        return unpack(buffer);
      } else {
        const str = atob(data);
        const buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
          buffer[i] = str.charCodeAt(i);
        }
        return unpack(buffer);
      }
    } catch (error) {
      console.log(error);
    }

    return data;
  },
};
