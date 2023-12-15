import { atom } from "recoil";

export const routeHistoryState = atom({
  key: "routeHistory",
  default: [""],
});
