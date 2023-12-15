"use client";

import { RecoilRoot } from "recoil";

export default function Providers({ children }: { children: React.ReactNode }) {
  // useSocketInitializer();

  return <RecoilRoot>{children}</RecoilRoot>;
}
