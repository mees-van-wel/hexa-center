import { pack, unpack } from "msgpackr";

export const trpcTransformer = {
  serialize: (data: any) => {
    if (!data) return data;

    try {
      return pack(data).toString("base64");
    } catch (error) {
      console.log(error);
    }

    return data;
  },
  deserialize: (data: string) => {
    if (!data) return data;

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
