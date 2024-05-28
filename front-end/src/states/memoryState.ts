import { atom } from "recoil";

export const memoryState = atom<Record<string, any>>({
  key: "memoryState",
  default: {},
});
