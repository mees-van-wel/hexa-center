"use client";

import useSocketInitializer from "@/initializers/useSocketInitializer";
import { type ReactNode } from "react";
import { RecoilRoot } from "recoil";

export default function Providers({ children }: { children: ReactNode }) {
  useSocketInitializer();

  return <RecoilRoot>{children}</RecoilRoot>;
}
