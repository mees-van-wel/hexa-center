import { atom } from "recoil";

export const searchState = atom<Record<string, string>>({
  key: "searchState",
  default: {},
});
