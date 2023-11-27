"use client";

import useInitializeSocket from "@/initializers/useInitializeSocket";
import { type ReactNode } from "react";
import { RecoilRoot } from "recoil";

export default function RecoilProvider({ children }: { children: ReactNode }) {
  useInitializeSocket();

  return <RecoilRoot>{children}</RecoilRoot>;
}
